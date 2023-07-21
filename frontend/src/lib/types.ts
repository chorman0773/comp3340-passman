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
