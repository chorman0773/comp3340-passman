# Communication Protocol

## Normative References

The keywords "MUST", "MUST NOT", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "MAY", "REQUIRED", "RECOMMENDED", and "OPTIONAL", when appear in all caps, 
 has the meaning as in [[RFC 2119]](https://datatracker.ietf.org/doc/html/rfc2119).

"AES" refers to the Symmetric Cipher Algorithm defined by [FIPS 197](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197-upd1.pdf).
"SHA3" refers to the Cryptographic Psuedorandom Function defined by [FIPS 202](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.202.pdf).

"SipHash" refers to the seeded Psuedorandom Function defined by <https://www.aumasson.jp/siphash/siphash.pdf>.

"Eliptic Curve" refers to the Assymetric Cipher Algorithm and Digital Signature Algorithm defined by [SEC 1](https://www.secg.org/sec1-v2.pdf).

Bincode refers to the binary format defined by <https://github.com/bincode-org/bincode/blob/8efe92ed93a15d98f20e96cef979cd6a2f7f85ce/docs/spec.md>, using little endian, Fixint encoding.
Structures defined in this document, and any other document as part of this specification are written in Rust structure syntax.