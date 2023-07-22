use std::{collections::HashMap, convert::Infallible, hash::Hasher};

use rocket::{
    http::Status,
    outcome::IntoOutcome,
    request::{FromRequest, Outcome},
    serde::json::Json,
    Either, State,
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
    inner: tokio::sync::RwLock<HashMap<u64, SessionState>>,
}

impl ActiveSessions {
    pub fn new() -> Self {
        Self {
            inner: tokio::sync::RwLock::new(HashMap::new()),
        }
    }
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

    let mut session = sessions.inner.write().await;

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
