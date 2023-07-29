import { HttpStatusCode } from "axios";
import type {
  Base32String,
  Base64String,
  HashType,
  PublicKeyType,
  Uuid,
} from "./types";
import { base64ToBytes, bytesToBase64 } from "./utilities";
import {
  decryptAES,
  deriveAES256Key,
  generateSessionToken,
  signValueRSA,
} from "./cryptography";
import { base32Decode } from "@ctrl/ts-base32";
import { passmanAxios } from "./axios";
import { type AuthenticationResult, authState } from "./stores";
import { goto } from "$app/navigation";

interface AuthenticationInfo {
  uuid: Uuid;
  pubkeyty: PublicKeyType;
  pubkey: Base64String;
  privkey: Base64String;
  iv: Base64String;
}

interface AuthenticationChallenge {
  sigHash: HashType;
  keyHash: HashType;
  token: Base64String;
}

const parseSecretKey = (secretKey: string) => {
  return secretKey.slice(2).replaceAll("-", "");
};

const getAuthInfo = async (email: string): Promise<AuthenticationInfo> => {
  const response = await passmanAxios.post<AuthenticationInfo>(
    "/auth/get-auth-info",
    { email_addr: email }
  );

  if (response.status !== HttpStatusCode.Ok) {
    throw "Failed to get authentication information";
  }

  return response.data;
};

const getAuthChallenge = async (
  uuid: Uuid
): Promise<AuthenticationChallenge> => {
  const response = await passmanAxios.post<AuthenticationChallenge>(
    "/auth/get-challenge",
    { uuid: uuid }
  );

  if (response.status != HttpStatusCode.Ok) {
    throw "Failed to get authentication challenge";
  }

  return response.data;
};

const sendChallengeResponse = async (
  sessionToken: Base64String,
  signedToken: Uint8Array
): Promise<boolean> => {
  const headers = {
    "Content-Type": "application/octet-stream",
    Authorization: "Bearer " + sessionToken,
  };

  const result = await passmanAxios.post(
    "/auth/challenge-response",
    signedToken,
    { headers }
  );

  return result.status == 200;
};

const authenticateUser = async (
  email: string,
  password: string,
  secretKey: Base32String
): Promise<AuthenticationResult> => {
  const authInfo = await getAuthInfo(email);

  const publicKeyBytes = base64ToBytes(authInfo.pubkey);
  const utf8PasswordBytes = new TextEncoder().encode(password);
  const secretKeyBytes = new Uint8Array(base32Decode(secretKey));

  const privateKeyAESEncryptionKey = await deriveAES256Key(
    utf8PasswordBytes,
    secretKeyBytes,
    publicKeyBytes
  );

  const privateKey = await decryptAES(
    privateKeyAESEncryptionKey,
    base64ToBytes(authInfo.privkey),
    base64ToBytes(authInfo.iv)
  );

  const challenge = await getAuthChallenge(authInfo.uuid);

  const token = base64ToBytes(challenge.token);
  const sessionToken = await generateSessionToken(token, publicKeyBytes);

  const signedToken = await signValueRSA(sessionToken, privateKey);

  const b64SessionToken = bytesToBase64(sessionToken);
  const b64PrivateKey = bytesToBase64(privateKey);

  const success = await sendChallengeResponse(b64SessionToken, signedToken);

  const result: AuthenticationResult = {
    loggedIn: success,
    userUuid: success ? authInfo.uuid : undefined,
    sessionToken: success ? b64SessionToken : undefined,
    privateKey: success ? b64PrivateKey : undefined,
  };

  return result;
};

const checkSession = async (sessionToken: Base64String) => {
  const response = await passmanAxios.get("/auth/current-session", {
    headers: {
      Authorization: "Bearer" + sessionToken,
    },
  });

  if (response.status !== HttpStatusCode.Ok) {
    return false;
  }

  return true;
};

const signOut = async (sessionToken?: Base64String) => {
  // TODO: for when {GET,DELETE} /auth/current-session exist
  // if (sessionToken) {
  //   try {
  //     await passmanAxios.delete("/auth/current-session", {
  //       headers: {
  //         Authorization: "Bearer" + sessionToken,
  //       },
  //     });
  //   } catch {
  //     /* if this fails, who cares. Just let the session time out */
  //   }
  // }

  authState.set({
    loggedIn: false,
    privateKey: undefined,
    sessionToken: undefined,
    userUuid: undefined,
  });

  await goto("/sign-in");
};

export {
  passmanAxios,
  parseSecretKey,
  authenticateUser,
  checkSession,
  signOut,
};
