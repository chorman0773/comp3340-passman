import type { Base64String, Uuid, Vault, VaultItem } from "./types";
import { passmanAxios } from "./auth";
import { base64ToBytes } from "./utilities";
import { HttpStatusCode, type AxiosRequestConfig } from "axios";
import { decryptAES, hashSha256 } from "./cryptography";
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
): Promise<VaultItem[]> => {
  if (PUBLIC_DISABLE_CRYPTO === "true") {
    return [
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
    ];
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

  const vaultContentsStr = new TextDecoder().decode(vaultContents);
  const { items } = JSON.parse(vaultContentsStr) as {
    items: VaultItem[];
  };

  return items;
};

export { getVaultContents, getVaults };
