import {
  PUBLIC_PASSMAN_SERVER_BASE_URL,
  PUBLIC_PASSMAN_HAS_HTTPS,
} from "$env/static/public";
import axios, { HttpStatusCode, type AxiosResponse } from "axios";
import type {
  Base32String,
  Base64String,
  HashType,
  PublicKeyType,
  Uuid,
} from "./types";
import { base64ToBytes, bytesToBase64 } from "./utilities";
import {
  decryptRSAKey,
  deriveAES256Key,
  generateSessionToken,
  signValueRSA,
} from "./cryptography";
import { base32Decode } from "@ctrl/ts-base32";

const useHttps = PUBLIC_PASSMAN_HAS_HTTPS === "true";
const passmanAxios = axios.create({
  baseURL: (useHttps ? "https://" : "http://") + PUBLIC_PASSMAN_SERVER_BASE_URL,

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
  iv: Base64String;
}

const getAuthInfo = async ({
  emailAddress,
}: GetAuthInfoRequest): Promise<
  AxiosResponse<GetAuthInfoResponse, GetAuthInfoRequest>
> => {
  if (!emailAddress) {
    console.log(emailAddress);
    throw "Email Address must be provided";
  }

  return passmanAxios.post<GetAuthInfoResponse>("/auth/get-auth-info", {
    email_addr: emailAddress,
  });
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

  return result.status == 200;
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
  if (authInfo.status !== HttpStatusCode.Ok) {
    throw "Unable to get auth info";
  }

  const publicKeyBytes = base64ToBytes(authInfo.data.pubkey);
  const utf8PasswordBytes = new TextEncoder().encode(password);
  const secretKeyBytes = new Uint8Array(base32Decode(secretKey));

  const privateKeyAESEncryptionKey = await deriveAES256Key(
    utf8PasswordBytes,
    secretKeyBytes,
    publicKeyBytes
  );

  const privateKey = await decryptRSAKey(
    privateKeyAESEncryptionKey,
    base64ToBytes(authInfo.data.privkey),
    base64ToBytes(authInfo.data.iv)
  );

  const challenge = await getAuthChallenge({ uuid: authInfo.data.uuid });
  const token = base64ToBytes(challenge.data.token);

  const sessionToken = await generateSessionToken(token, publicKeyBytes);
  console.log({ sessionToken: bytesToBase64(sessionToken) });

  // UP TO HERE IS CORRECT. DEVIATION FROM HERE IS RESULT OF FUNCTIONS BELOW

  const signedToken = await signValueRSA(sessionToken, privateKey);
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

const parseSecretKey = (secretKey: string) => {
  return secretKey.slice(3).replaceAll("-", "");
};

export { passmanAxios, authenticateUser, parseSecretKey };
