import { SipHash } from "./siphash";
import type { Base64String } from "./types";
import { PublicKeyType } from "./types";
import { base64ToBytes } from "./utilities";

const HMAC_ROUNDS = 1024;
const HashAlgorithmNames = Object.freeze({
  sha256: "SHA-256",
  sha384: "SHA-384",
  sha512: "SHA-512",
});

const CipherAlgorithmNames = Object.freeze({
  aesGcm: "AES-GCM",
  rsaPkcs: "RSASSA-PKCS1-v1_5",
});

const hmac = async (algorithm: string, data: Uint8Array, token: Uint8Array) => {
  const hashResult = await crypto.subtle.digest(algorithm, token);
  const hashedToken = new Uint8Array(hashResult);

  const result = await crypto.subtle.digest(
    algorithm,
    Uint8Array.from([...hashedToken, ...data])
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
    token = await hmac(HashAlgorithmNames.sha256, password, token);
  }

  return token;
};

const decryptKey = async (
  encryptionKey: Uint8Array,
  data: Uint8Array,
  initializationVector: Uint8Array
): Promise<Uint8Array> => {
  const importedKey = await crypto.subtle.importKey(
    "raw",
    encryptionKey,
    { name: CipherAlgorithmNames.aesGcm },
    false,
    ["decrypt"]
  );

  const decryptedValue = await crypto.subtle.decrypt(
    {
      name: CipherAlgorithmNames.aesGcm,
      iv: initializationVector,
    },
    importedKey,
    data
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

  resultView.setUint32(0, l);
  resultView.setUint32(4, h);

  return u8Buffer;
};

const signValue = async (value: Uint8Array, privateKey: Uint8Array) => {
  const importedKey = await crypto.subtle.importKey(
    "raw",
    privateKey,
    { name: CipherAlgorithmNames.rsaPkcs, hash: HashAlgorithmNames.sha256 },
    false,
    ["sign"]
  );

  const signedToken = await crypto.subtle.sign(
    { name: CipherAlgorithmNames.rsaPkcs, hash: HashAlgorithmNames.sha256 },
    importedKey,
    value
  );

  return new Uint8Array(signedToken);
};

export { deriveAES256Key, decryptKey, generateSessionToken, signValue };
