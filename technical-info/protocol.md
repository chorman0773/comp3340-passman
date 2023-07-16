# Communication Protocol

## Normative References

The keywords "MUST", "MUST NOT", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "MAY", "REQUIRED", "RECOMMENDED", and "OPTIONAL", when appear in all caps, 
 has the meaning as in [[RFC 2119]](https://datatracker.ietf.org/doc/html/rfc2119).

The HTTP protocol is described as in [[RFC 9110]](https://datatracker.ietf.org/doc/html/rfc9110).

The Bearer method is describe as in [[RFC 6750]](https://www.rfc-editor.org/rfc/rfc6750.html).

UUID is defined in [[RFC 4112]](https://datatracker.ietf.org/doc/htl/rfc4112) and the update Internet-Draft [Universally Unique IDentifiers (UUID) (revision)](https://datatracker.ietf.org/doc/html/draft-ietf-uuidrev-rfc4122bis) describes version 6 and version 7 used by this document in recommendations, as well as the full (all bits 1) UUID.

"AES" refers to the Symmetric Cipher Algorithm defined by [FIPS 197](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197-upd1.pdf).
"SHA3" refers to the Cryptographic Psuedorandom Function defined by [FIPS 202](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.202.pdf).

"SipHash" refers to the seeded Psuedorandom Function defined by <https://www.aumasson.jp/siphash/siphash.pdf>.

"Eliptic Curve" refers to the Assymetric Cipher Algorithm and Digital Signature Algorithm defined by [SEC 1](https://www.secg.org/sec1-v2.pdf).

"Curve25519" or "Ec25519" refers to the Eliptic Curve Algorithm parameterized by the curve and field defined in <https://cr.yp.to/ecdh.html>.

Bincode refers to the binary format defined by <https://github.com/bincode-org/bincode/blob/8efe92ed93a15d98f20e96cef979cd6a2f7f85ce/docs/spec.md>, using little endian, Fixint encoding.


## Request/Response Body

Multiple formats are supported for both requests and responses. Each server MUST support each specified format, and a client MUST support at least once format for requests and at least one format for responses. These MAY be different formats.

The Client MUST set the Content-Type header to the appropriate type specified for the format it is sending data in. If the server does not recognize the Content-Type, it MUST reject the request with 400 Bad Request with no content. The server MAY accept additional content types than are specified here, but SHOULD NOT accept content types that are not specified by this or a future version of this specification. 

The client SHOULD set the Accept header to the apprpriate type (or types) it requests the server to accept. If it does not set this header than the server MAY respond in any format specified here, but SHOULD respond in the Content-Type given by the server. If multiple formats are set, the server MAY choose any content type from the list in any manner it chooses. If the server does not recognize a content type specified in the accept field it MUST ignore that content type, but if it does not recognize any content type specified, it MUST reject the request with 406 Not Acceptable with no content. The server MAY accept additional content types than are specified here, but SHOULD NOT accept content types that are not specified by this or a future version of this specification. 

The content types specified for use with this protocol are as follows:
1. application/x-bincode-object: An object specified in Bincode format, given by the appropriate Rust Structure for the request or response.
2. application/json: An object specifed in json format, where structures are composed of objects where keys are field names and values are the value assigned, byte arrays/vectors are composed of base64 encoded strings, and enums are encoded as the name of the enumerator. Complex enums are an object with a field called `t` giving the name of the enumerator, and the remaining fields are given by name. A lone field of a tuple variant is given with the field called `v`.


Base64 encoded values are encoded without padding, however server's MUST accept base64 encoding that includes tail padding, and such values MUST be treated identically to the version without padding.

## Errors

Whenever an error occurs in the protocol, a server SHALL return the error in two parts: An HTTP Status Code indicating the error, and a bincode object that describes information about the error.

The error object MUST BE of the following structure type
```rust
pub struct Error{
    code: ErrorCode,
    human_error: String
}
```

`human_error` is a string set by the server which SHOULD be descriptive of the error in a manner meaningful to an end user. It SHOULD be in a language specified in the Accept-Language header if the server supports any of those languages, but it MAY be in any language if the server does not support any specified language.

`code` is set to a value of the following enum, in accordance with the particular error:

```rust
pub enum ErrorCode{
    InvalidRequest,
    NoSuchUser,
    RateLimitExceeded(u32),
    InvalidSession,
    AuthenticatonFailure
}
```

## Invalid Request Bodies

When a request is made to the server with a body that the server cannot decode, or contains missing fields (in free-form formats such as application/json), it MUST return an error with code `ErrorCode::InvalidRequest` with Status Code 400 Bad Request.

## Tunneling

Each endpoint other than those in `auth` and `status` operates under an AES-256 cipher mode, using GCM Block Cipher Mode, and PKCS5 padding. 

The IV is computed by the first 96 bytes of `HMAC-key_type(state, session-token)`. Each time a request is made in the tunnel, and either returns succesfully, or one of the folowing error codes, the state is updated to `HMAC-key_hash(session-token,state)`. Both  `session-token` and the initial value for `state` are determined during authentication.

Each endpoint describes a mode it operates in, stating either `Tunneled` or `Untunneled`.

Tunneled endpoints must have an HTTP Header of `Authorization: Bearer <session-token>` where `session-token` is base64 encoded. 

If this header is not present for a tunneled endpoint, or refers to a session token that does not exist, the server returns 401 Not Authorized, with an error code of `ErrorCode::InvalidSession`. The `WWW-Authenticate` header must be set to a challenge of `Bearer`. A client wishing to access the resource must complete the authentication steps set forth in [auth](auth.md#authentication-steps).



## Rate Limits

On any endpoints within this specification, the server may implement rate limiting in a server-depenedent manner, for a variety of security related purposes, including to prevent Denial of service attacks.

When the server rejects a request due to a rate limit, it returns an error wth code `ErrorCode::RateLimitExceed(t)` where `t` is either `0` or a hint as to the number of seconds the client should wait before attempting another request. If t is non-zero, then the client SHOULD NOT make another request prior to that many seconds having elapsed. It MAY respond with either the status code 429 Too Many Requests or the status code 420 Enhance Your Calm. It is RECOMMENDED that any server return the status code 429 Too Many Requests. 

Unless that endpoint says otherwise, the server MAY return an error for a request made to any endpoint by the client. 


## Basic Types

The following basic types are used throughout the specification:

### Uuid

```rust
pub struct Uuid{
    least: u64,
    most: u64
}
```

A universally unique identifier encoded as the 64 least significant bits followed immediately by the 64 most significant bits.


### PublicKeyType

```rust
pub enum PublicKeyType{
    Ec25519
}
```

The `PublicKeyType` enum describes the type of a public (or private) key. Presently only one public key type is supported, being `Ec25519` which describes the eliptic curve
 assymetric cipher and signature scheme using Curve25519.

### HashType

```rust
pub enum HashType{
    Sha256,
    Sha3_256
}
```

The `HashType` enum describes the type