export type Uuid = string;
export type Base64String = string;
export type Base32String = string;

export enum PublicKeyType {
  Ec25519,
  Rsa2048,
}

export enum HashType {
  Sha256,
  Sha3_256,
}
