# Authentication Endpoints


## Normative Reference

The content of [protocol](protocol.md) is included by normative reference, including all of it's references.

## Base path

The endpoints in this section are all described within the `/auth` path

## get-auth-info

Path: `/auth/get-auth-info`

Mode: Untunneled

Required Headers: None

Method: POST

Request body:
```rust
pub struct GetAuthInfoRequest{
    email_addr: String
}
```

where `email_addr` is the user email for the account to query.


Response:
* Error or 200 OK

```rust
pub struct GetAuthInfoReponse{
    uuid: Uuid,
    pubkeyty: PublicKeyType,
    pubkey: [u8;32],
    privkey: Vec<u8>,
}
```

* `uuid` is the uuid of the account assigned by the server. 
* `pubkeyty` is the type of the public key stored by the server. 
* `pubkey` is the content of the public key.
* `privkey` is the content of the (encrypted) private key.

On Error:
* If the account is not found, returns 404 Not Found and yields an `ErrorCode::NoSuchAccount`

## get-challenge

Path: `/auth/get-challenge`

Mode: Untunneled

Required Headers: None

Method: POST

Request body:
```rust
pub struct GetChallengeRequest{
    uuid: Uuid,
}
```

* `uuid` is the uuid of the account

Response:
* Error or 200 OK

```rust
pub struct GetChallengeResponse{
    sig_hash: HashType,
    key_hash: HashType,
    token: [u8;32]
}
```

* `token` is a unique authentication challenge token

On Error:
* If the account is not found, returns 404 Not Found and yields an `ErrorCode::NoSuchAccount`


The `token` is used to derive 4 pieces of information:
* A session token, which is computed by `Siphash-4-2(pubkey,token[0..16] ^ token[16..])`
* A response signature, which is `Sign-sig_hash(token,privkey)`
* A GCM initial IV state, computed from `HMAC-key_hash(pubkey,token)`
* The tunnel key, which is `HMAC-key_hash(token,pubkey)`


## challenge-response

Path: `/auth/challenge-response`

Mode: Untunneled

Required Headers: `Authorization: Bearer <computed session token>`

Method: POST

Request body: application/octet-stream challenge signature

Response: 
* Error or 204 No Content

Errors:
* 401 Not Authorized with an error code of `ErrorCode::InvalidSession`: If the computed session token does not exist.
* 403 Forbidden with an error code of `ErrorCode::AuthenticatonFailure`: If the response signature is incorrect.

## current-session

Path: `/auth/current-session`

Mode: Untunnled

Method: DELETE or GET

Required Headers: `Authorization: Bearer <session token>`

Response:
* Error or 200 OK with an empty body

Errors:
* 401 Not Authorized with an error code of `ErrorCode::InvalidSession`: If the session token does not exist.

After 200 OK on a DELETE to this endpoint, the given session token is invalidated.

`GET` may be used to ensure that the current session is currently valid. The client MAY perform such a request at any time with no issues. 
The server SHOULD NOT rate limit consecutive successful requests, unless the requests are causing a strain on the server's resources to fulfil, or may impact the reliability of the server. The server MAY rate limit multiple unsuccessful requests, as a security measure to defeat guessing of session tokens.

## active-sessions

Path: `/auth/active-sessions`

Mode: Tunneled

Method: DELETE or GET

Required Headers: `Authorization: Bearer <session token>`

Response:
* DELETE: Error or 200 OK with an empty body
* GET: Error or 200 OK with the given response body

```rust
pub struct ActiveSessions{
    sessions: Vec<u64>
}
```

where each element of `sessions` is an active session with the server for the current account.

Errors:
* 401 Not Authorized with an error code of `ErrorCode::InvalidSession`: If the session token does not exist.


After 200 OK when DELETEing this endpoint, all currently active sessions are ended. 
The session token used for the request may be used in a `/auth/invalidate-session` request, but otherwise may not be used to perform any requests to any endpoint that require a Tunneled request.


## Authentication Process

To authenticate to the server, a client MUST perform the steps in this section.

1. If the client has a cached version of the private key, it performs a request of the `/auth/validate-key` endpoint with the time which it last fetched the private key, and MUST use the cached key only if the response is 200 OK. Otherwise, it MUST fetch the private key using `/auth/get-auth-info` endpoint. 
2. The decryption key for the private key is generated as follows. First, the tag is computed by prepending the account public key to the secret key given to the client. Then, the key derivation function KDF-HMAC_SHA256 is used to derive the key, with the tag and the provided password. The description of the KDF is below. 
3. The private key is decrypted by the client using the decryption key generated above. The private key SHOULD be validated by deriving the associated public key, and checking that it matches the public key transited, and if validation fails, the client MUST generate and display an error.
4. The client performs a request of the `/auth/get-challenge` endpoint. It SHOULD NOT perform this request if validation of the private key fails.
5. The client signs the token generated via `/auth/get-challenge`. Then the client makes a request to `/auth/challenge-reponse`.

When the client logs out, it MUST invalidate its own session with a DELETE request to `/auth/current-session` (untunneled)