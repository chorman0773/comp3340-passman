use std::{borrow::Cow, collections::HashMap, convert::Infallible, hash::Hasher};

use base64::Engine;
use openssl::{
    hash::MessageDigest,
    pkey::{PKey, PKeyRef},
};
use rocket::{
    http::Status,
    outcome::IntoOutcome,
    request::{FromRequest, Outcome},
    serde::json::Json,
    Either, Request, State,
};
use siphasher::sip::SipHasher24;

use crate::protocol::{ByteArray, ByteVec, ErrorCode, HashType, PublicKeyType, Uuid};

#[derive(serde::Serialize, serde::Deserialize, bincode_derive::Encode, bincode_derive::Decode)]
pub struct GetAuthInfoRequest {
    email_addr: String,
}

#[derive(serde::Serialize, serde::Deserialize, bincode_derive::Encode, bincode_derive::Decode)]
pub struct GetAuthInfoResponse {
    uuid: Uuid,
    pubkeyty: PublicKeyType,
    pubkey: ByteVec,
    privkey: ByteVec,
    iv: ByteArray<16>,
}

#[derive(serde::Serialize, serde::Deserialize, bincode_derive::Encode, bincode_derive::Decode)]
pub struct GetChallengeRequest {
    uuid: Uuid,
}

#[derive(serde::Serialize, serde::Deserialize, bincode_derive::Encode, bincode_derive::Decode)]
pub struct GetChallengeResponse {
    sig_hash: HashType,
    key_hash: HashType,
    token: ByteArray<32>,
}

const TEST_PUBKEY: &[u8] = include_bytes!("../tests/test.pub");
const TEST_IV: [u8; 16] = *include_bytes!("../tests/test.iv");
const TEST_PRIVKEY: &[u8] = include_bytes!("../tests/test.priv");

#[rocket::post("/get-auth-info", data = "<body>")]
pub async fn get_auth_info(body: Json<GetAuthInfoRequest>) -> Json<GetAuthInfoResponse> {
    if body.0.email_addr == "test@example.org" {
        Json(GetAuthInfoResponse {
            uuid: Uuid::nil(),
            pubkeyty: PublicKeyType::Rsa,
            pubkey: ByteVec::from_slice(TEST_PUBKEY),
            privkey: ByteVec::from_slice(TEST_PRIVKEY),
            iv: ByteArray::new(TEST_IV),
        })
    } else {
        todo!()
    }
}

#[derive(Copy, Clone, Debug, Hash, PartialEq, Eq)]
pub struct SessionState {
    is_authed: bool,
    assoc_user: Uuid,
    token: ByteArray<32>,
}

pub struct ActiveSessions {
    inner: std::sync::RwLock<HashMap<u64, SessionState>>,
}

impl ActiveSessions {
    pub fn new() -> Self {
        Self {
            inner: std::sync::RwLock::new(HashMap::new()),
        }
    }
}

fn base64enc(x: &[u8]) -> String {
    let engine = base64::prelude::BASE64_STANDARD;

    engine.encode(x)
}

#[rocket::post("/get-challenge", data = "<body>")]
pub async fn get_challenge(
    sessions: &State<ActiveSessions>,
    body: Json<GetChallengeRequest>,
) -> Json<GetChallengeResponse> {
    let mut state = SessionState {
        is_authed: false,
        assoc_user: body.uuid,
        token: ByteArray::new([0; 32]),
    };

    openssl::rand::rand_bytes(&mut state.token).unwrap();

    let [lo, hi] = unsafe { core::mem::transmute::<_, [[u8; 16]; 2]>(state.token) };

    let key = u128::from_le_bytes(lo) ^ u128::from_le_bytes(hi);

    let mut hasher = SipHasher24::new_with_keys(key as u64, (key >> 64) as u64);

    hasher.write(TEST_PUBKEY);

    let token = hasher.finish();

    eprintln!("Session Token hex: {:x}", token);

    eprintln!(
        "Session {}: {}",
        base64enc(&token.to_be_bytes()),
        base64enc(&state.token)
    );

    let mut session = sessions.inner.write().unwrap();

    session.insert(token, state);

    Json(GetChallengeResponse {
        sig_hash: HashType::Sha256,
        key_hash: HashType::Sha256,
        token: state.token,
    })
}

pub struct Authorization {
    token: u64,
}

#[rocket::async_trait]
impl<'re> rocket::request::FromRequest<'re> for Authorization {
    type Error = Json<crate::protocol::Error>;

    async fn from_request(request: &'re Request<'_>) -> Outcome<Authorization, Self::Error> {
        let tok = match request
            .headers()
            .get_one("Authorization")
            .and_then(|st| st.strip_prefix("Bearer "))
        {
            Some(tok) => tok,
            None => {
                return Outcome::Failure((
                    Status::Forbidden,
                    Json(crate::protocol::Error {
                        code: ErrorCode::InvalidSession,
                        text: format!("Please authenticate"),
                    }),
                ))
            }
        };

        let mut bytes = [0u8; 16];

        eprintln!("Got session token {}", tok);

        let engine = base64::prelude::BASE64_STANDARD;

        match engine.decode_slice(tok, &mut bytes) {
            Ok(_) => Outcome::Success(Authorization {
                token: u64::from_be_bytes(
                    unsafe { core::mem::transmute::<_, [[u8; 8]; 2]>(bytes) }[0],
                ),
            }),
            Err(_) => Outcome::Failure((
                Status::Forbidden,
                Json(crate::protocol::Error {
                    code: ErrorCode::InvalidSession,
                    text: format!("Failed to validate session"),
                }),
            )),
        }
    }
}

fn get_key_for_session(
    auth: Authorization,
    active_sessions: &ActiveSessions,
) -> Option<(Cow<[u8]>, ByteArray<32>)> {
    let guard = active_sessions.inner.read().unwrap();
    let session = guard.get(&auth.token)?;

    let uuid = session.assoc_user;

    let token = session.token;

    if uuid == Uuid::nil() {
        return Some((Cow::Borrowed(TEST_PUBKEY), token));
    } else {
        todo!()
    }
}

#[rocket::post("/challenge-response", data = "<body>")]
pub async fn challenge_response(
    auth: Authorization,
    active_sessions: &State<ActiveSessions>,
    body: Vec<u8>,
) {
    let (key, token) = get_key_for_session(auth, active_sessions).expect("No such user yet");

    let openssl_key = openssl::rsa::Rsa::public_key_from_der_pkcs1(&key).unwrap();

    let key = PKey::from_rsa(openssl_key).unwrap();

    let mut verifier = openssl::sign::Verifier::new(MessageDigest::sha256(), &key).unwrap();

    if verifier.verify_oneshot(&body, &token).unwrap() {
        ()
    } else {
        // panic!("Auth failed")
    }
}
