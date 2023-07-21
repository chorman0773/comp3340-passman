export interface LastUser {
  email: string;
  secretKey: string; // TODO: this really needs to be encrypted
}

export interface StoredObject {
  uuid: string;
}

export interface Vault extends StoredObject {
  name: string;
  description: string;
  items: VaultItem[];
}

export interface VaultItem extends StoredObject {
  name: string;
  summaryText: string;
  fields: Field[];
}

export interface Field {
  label: string;
  value: FieldValue;
}

export enum FieldType {
  PlainText,
}

export interface FieldValue {
  type: FieldType;
  isMasked: boolean;
  base64Value: string;
}

// Actual types:
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
