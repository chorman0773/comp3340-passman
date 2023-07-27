import type { Base64String, Uuid, Vault, VaultItem } from "./types";
import { passmanAxios } from "./auth";
import { base64ToBytes } from "./utilities";
import { decryptAES, decryptRSA } from "./cryptography";
import { AxiosHeaders, HttpStatusCode } from "axios";

const getVaults = async (
  userUuid: Uuid,
  sessionToken: Base64String
): Promise<Vault[]> => {
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
  const privKeyBytes = base64ToBytes(privKey);

  const headers = {
    Authorization: "Bearer " + sessionToken,
  };

  const path = "/vaults/" + uuid;
  const iv = (await passmanAxios.get(`${path}/iv`, { headers })).data;
  const key = (await passmanAxios.get(`${path}/key`, { headers })).data;
  const content = (await passmanAxios.get(`${path}/data`, { headers })).data;

  const vaultSecretKey = await decryptRSA(privKeyBytes, key);
  console.log("Secret key OK");

  const vaultContents = await decryptAES(vaultSecretKey, content, iv);
  console.log("Contents OK");

  const vaultContentsStr = new TextDecoder().decode(vaultContents);
  const { items } = JSON.parse(vaultContentsStr) as {
    items: VaultItem[];
  };

  return items;
};

export { getVaultContents, getVaults };
