import { SipHash } from "./siphash";

const HMAC_ROUNDS = 1024;
const HashAlgorithmNames = Object.freeze({
  sha256: "SHA-256",
  sha384: "SHA-384",
  sha512: "SHA-512",
});

const CipherAlgorithmNames = Object.freeze({
  aesGcm: "AES-GCM",
  rsaPkcs1v5: "RSASSA-PKCS1-v1_5",
  rsaOeap: "RSA-OEAP",
  hmac: "HMAC",
  aesCbc: "AES-CBC",
});

const hmacSha256 = async (message: Uint8Array, key: Uint8Array) => {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    {
      name: CipherAlgorithmNames.hmac,
      hash: HashAlgorithmNames.sha256,
    },
    false,
    ["sign"]
  );

  const result = await crypto.subtle.sign(
    CipherAlgorithmNames.hmac,
    cryptoKey,
    message
  );

  return new Uint8Array(result);
};

const hashSha256 = async (data: Uint8Array) => {
  const result = await crypto.subtle.digest(
    {
      name: HashAlgorithmNames.sha256,
    },
    data
  );

  return new Uint8Array(result);
};

const deriveAES256Key = async (
  password: Uint8Array,
  secretKey: Uint8Array,
  publicKey: Uint8Array
) => {
  let token = Uint8Array.from([...publicKey, ...secretKey]);

  for (let i = 0; i < HMAC_ROUNDS; i++) {
    token = await hmacSha256(password, token);
  }

  return token;
};

const decryptAES = async (
  encryptionKey: Uint8Array,
  encryptedData: Uint8Array,
  initializationVector: Uint8Array
): Promise<Uint8Array> => {
  const importedKey = await crypto.subtle.importKey(
    "raw",
    encryptionKey,
    { name: CipherAlgorithmNames.aesCbc },
    false,
    ["decrypt"]
  );

  const decryptedValue = await crypto.subtle.decrypt(
    {
      name: CipherAlgorithmNames.aesCbc,
      iv: initializationVector,
    },
    importedKey,
    encryptedData
  );

  return new Uint8Array(decryptedValue);
};

const decryptRSA = async (
  encryptionKey: Uint8Array,
  encryptedData: Uint8Array
): Promise<Uint8Array> => {
  const importedKey = await crypto.subtle.importKey(
    "pkcs8",
    encryptionKey,
    { name: CipherAlgorithmNames.rsaOeap, hash: HashAlgorithmNames.sha256 },
    false,
    ["decrypt"]
  );

  const decryptedValue = await crypto.subtle.decrypt(
    {
      name: CipherAlgorithmNames.rsaOeap,
    },
    importedKey,
    encryptedData
  );

  return new Uint8Array(decryptedValue);
};

const generateSessionToken = async (token: Uint8Array, pubkey: Uint8Array) => {
  const low = token.slice(0, 16);
  const high = token.slice(16, 32);

  const xorredToken = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    xorredToken[i] = low[i] ^ high[i];
  }

  const dataView = new DataView(xorredToken.buffer);
  const u32Array = new Uint32Array(4);
  for (let i = 0; i < 4; i++) {
    u32Array[i] = dataView.getUint32(4 * i, true);
  }

  const { l, h } = SipHash.hash(u32Array, pubkey);

  const u8Buffer = new Uint8Array(8);
  const resultView = new DataView(u8Buffer.buffer);

  resultView.setUint32(0, h, false);
  resultView.setUint32(4, l, false);

  return u8Buffer;
};

const signValueRSA = async (value: Uint8Array, privateKey: Uint8Array) => {
  const importedKey = await crypto.subtle.importKey(
    "pkcs8",
    privateKey,
    { name: CipherAlgorithmNames.rsaPkcs1v5, hash: HashAlgorithmNames.sha256 },
    false,
    ["sign"]
  );

  const signedToken = await crypto.subtle.sign(
    { name: CipherAlgorithmNames.rsaPkcs1v5, hash: HashAlgorithmNames.sha256 },
    importedKey,
    value
  );

  return new Uint8Array(signedToken);
};

export {
  hashSha256,
  deriveAES256Key,
  decryptAES,
  decryptRSA,
  generateSessionToken,
  signValueRSA,
};
