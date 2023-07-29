import type { Base64String, Uuid, Vault, VaultItem } from "./types";
import { passmanAxios } from "./auth";
import { base64ToBytes, bytesToBase64 } from "./utilities";
import { HttpStatusCode, type AxiosRequestConfig } from "axios";
import { decryptAES, encryptAES, hashSha256 } from "./cryptography";
import { PUBLIC_DISABLE_CRYPTO } from "$env/static/public";

const getVaults = async (
  userUuid: Uuid,
  sessionToken: Base64String
): Promise<Vault[]> => {
  if (PUBLIC_DISABLE_CRYPTO === "true") {
    return [
      {
        name: "Personal Vault",
        description: "A personal vault, just for you!",
        uuid: "1",
      },
    ];
  }

  const response = await passmanAxios.get<Vault[]>(
    `/users/${userUuid}/vaults`,
    { headers: { Authorization: "Bearer " + sessionToken } }
  );

  if (response.status !== HttpStatusCode.Ok) {
    throw "Failed to fetch vaults";
  }

  return response.data;
};

const getVaultContents = async (
  uuid: Uuid,
  sessionToken: Base64String,
  privKey: Base64String
): Promise<{ secretKey: Base64String; contents: VaultItem[] }> => {
  if (PUBLIC_DISABLE_CRYPTO === "true") {
    return {
      secretKey: "",
      contents: [
        {
          uuid: crypto.randomUUID(),
          name: "1Password",
          website: "https://1password.com",
          summaryText: "user@example.com",
          fields: {
            username: "user@example.com",
            password: "examplePassword" + crypto.randomUUID(),
            website: "https://my.1password.ca",
          },
        },
        {
          uuid: crypto.randomUUID(),
          name: crypto.randomUUID(),
          website: "https://figma.com",
          summaryText: "user@example.com",
          fields: {
            username: "user@example.com",
            password: crypto.randomUUID(),
            website: "https://figma.com",
          },
        },
      ],
    };
  }

  const privKeyBytes = base64ToBytes(privKey);

  const axiosConfig: AxiosRequestConfig = {
    headers: {
      Authorization: "Bearer " + sessionToken,
    },
    responseType: "arraybuffer",
    transformResponse: (r) => new Uint8Array(r),
  };

  const path = "/vaults/" + uuid;
  const ivBytes = (await passmanAxios.get(`${path}/iv`, axiosConfig)).data;
  const keyBytes = (await passmanAxios.get(`${path}/key`, axiosConfig)).data;
  const contents = (await passmanAxios.get(`${path}/data`, axiosConfig)).data;

  const privKeyHash = await hashSha256(privKeyBytes);

  // TODO: probably not use the same IV for both?
  const vaultSecretKey = await decryptAES(privKeyHash, keyBytes, ivBytes);
  const vaultContents = await decryptAES(vaultSecretKey, contents, ivBytes);

  const contentStr = new TextDecoder().decode(vaultContents);
  return {
    secretKey: bytesToBase64(vaultSecretKey),
    contents: JSON.parse(contentStr),
  };
};

const setVaultContents = async (
  vaultUuid: Uuid,
  accountInfo: { sessionToken: Base64String; privateKey: Base64String },
  vaultInfo: { secretKey: Base64String; newContents: VaultItem[] }
) => {
  // generate random bytes for new IV
  const ivBytes = new Uint8Array(16);
  crypto.getRandomValues(ivBytes);

  const vaultSecretKeyBytes = base64ToBytes(vaultInfo.secretKey);
  const encryptedContents = await encryptAES(
    vaultSecretKeyBytes,
    new TextEncoder().encode(JSON.stringify(vaultInfo.newContents)),
    ivBytes
  );

  const privKeyHash = await hashSha256(base64ToBytes(accountInfo.privateKey));
  const encVaultSecretKey = await encryptAES(
    privKeyHash,
    vaultSecretKeyBytes,
    ivBytes
  );

  const path = "/vaults/" + vaultUuid;
  const pushToServer = (path: string, bytes: Uint8Array) => {
    return passmanAxios.post(path, bytes, {
      headers: {
        Authorization: "Bearer " + accountInfo.sessionToken,
        "Content-Type": "application/octet-stream",
      },
    });
  };

  // Sure hope this works :ferrisclueless:
  await pushToServer(path + "/data", encryptedContents);
  await pushToServer(path + "/key", encVaultSecretKey);
  await pushToServer(path + "/iv", ivBytes);
};

export { getVaultContents, setVaultContents, getVaults };
