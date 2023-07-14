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
    privkey: [u8;32],
}
```

* `uuid` is the uuid of the account assigned by the server. 
* `pubkeyty` is the type of the public key stored by the server. 
* `pubkey` is the content of the public key.
* `privkey` is the content of the private key.

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


Request body: application/octet-stream challenge signature

Response: 
* Error or 204 No Content

Errors:
* 401 Not Authorized with an error code of `ErrorCode::InvalidSession`: If the computed session token does not exist.
* 403 Forbidden with an error code of `ErrorCode::AuthenticatonFailure`: If the response signature is incorrect.

## validate-key

Path: `/auth/validate-key`

Mode: Untunneled

Required Headers: None

Request Body:

```rust
pub struct 
```

## Authentication Process

To authenticate to the server, a client MUST perform the steps in this session.

