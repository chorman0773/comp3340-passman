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
}
```

`uuid` is the uuid of the account assigned by the server. 
`pubkeyty` is the type of the public key stored by the server. 
`pubkey` is the content of the public key.

On Error:
* If the account is not found, returns 404 Not Found and yields an `ErrorCode::NoSuchAccount`

## get-identity

Path: `/aut/get-auth-identity`

Mode: Untunneled

Required Headers: None

Method: POST

Request Body
```rust
pub struct GetIdentityRequest{
    uuid: Uuid
}
```