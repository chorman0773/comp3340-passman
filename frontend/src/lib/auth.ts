import { PUBLIC_PASSMAN_SERVER_BASE_URL } from "$env/static/public";
import axios, { type AxiosResponse } from "axios";
import type {
  Base32String,
  Base64String,
  HashType,
  PublicKeyType,
  Uuid,
} from "./types";
import { base64ToBytes, bytesToBase64 } from "./utilities";
import {
  decryptKey,
  deriveAES256Key,
  generateSessionToken,
  signValue,
} from "./cryptography";
import { base32Decode } from "@ctrl/ts-base32";

const passmanAxios = axios.create({
  baseURL: "https://" + PUBLIC_PASSMAN_SERVER_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

interface GetAuthInfoRequest {
  emailAddress: string;
}

interface GetAuthInfoResponse {
  uuid: Uuid;
  pubkeyty: PublicKeyType;
  pubkey: Base64String;
  privkey: Base64String;
  cipheriv: Base64String;
}

const getAuthInfo = async (
  body: GetAuthInfoRequest
): Promise<AxiosResponse<GetAuthInfoResponse, GetAuthInfoRequest>> => {
  return passmanAxios.post<GetAuthInfoResponse>("/auth/get-auth-info", body);
};

// then decrypt privkey
// (using password + secret key + public key to generate AES256 key)

interface GetAuthChallengeRequest {
  uuid: Uuid;
}

interface GetAuthChallengeResponse {
  sigHash: HashType;
  keyHash: HashType;
  token: Base64String;
}

const getAuthChallenge = async (
  body: GetAuthChallengeRequest
): Promise<
  AxiosResponse<GetAuthChallengeResponse, GetAuthChallengeRequest>
> => {
  return passmanAxios.post<GetAuthChallengeResponse>(
    "/auth/get-challenge",
    body
  );
};

// generate:
// - sign the challenge token with private key (decrypted earlier)
// - compute session token (token + pubkey???)

const sendChallengeResponse = async (
  sessionToken: Base64String,
  signedToken: Uint8Array
): Promise<boolean> => {
  const result = await passmanAxios.post(
    "/auth/challenge-response",
    signedToken,
    {
      headers: {
        "Content-Type": "application/octet-stream",
        Authorization: "Bearer " + sessionToken,
      },
    }
  );

  return result.status == 204;
};

interface AuthenticationResult {
  authSuccess: boolean;
  sessionToken?: Base64String;
  privateKey?: Base64String;
}

const authenticateUser = async (
  email: string,
  password: string,
  secretKey: Base32String
): Promise<AuthenticationResult> => {
  const authInfo = await getAuthInfo({ emailAddress: email });
  const publicKey = base64ToBytes(authInfo.data.pubkey);
  const utf8Password = new TextEncoder().encode(password);

  const privateKeyEncryptionKey = await deriveAES256Key(
    utf8Password,
    new Uint8Array(base32Decode(secretKey)),
    publicKey
  );

  const privateKey = await decryptKey(
    privateKeyEncryptionKey,
    base64ToBytes(authInfo.data.privkey),
    base64ToBytes(authInfo.data.cipheriv)
  );

  const challenge = await getAuthChallenge({ uuid: authInfo.data.uuid });

  const token = base64ToBytes(challenge.data.token);
  const sessionToken = await generateSessionToken(token, publicKey);
  const signedToken = await signValue(sessionToken, privateKey);

  const b64SessionToken = bytesToBase64(sessionToken);
  const b64PrivateKey = bytesToBase64(privateKey);

  const success = await sendChallengeResponse(
    bytesToBase64(sessionToken),
    signedToken
  );

  return {
    authSuccess: success,
    sessionToken: success ? b64SessionToken : undefined,
    privateKey: success ? b64PrivateKey : undefined,
  };
};

export { passmanAxios, authenticateUser };
