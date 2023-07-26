import type { Base64String, Uuid } from "./types";
import { passmanAxios } from "./auth";
import { base64ToBytes } from "./utilities";
import { decryptAES, decryptRSA } from "./cryptography";
import type { Vault, VaultItem } from "./stores";
import { HttpStatusCode } from "axios";

const getVaults = async (
  userUuid: Uuid,
  sessionToken: Base64String
): Promise<Vault[]> => {
  const headers = {
    Authorization: "Bearer " + sessionToken,
  };

  const response = await passmanAxios.get<Vault[]>(
    `/users/${userUuid}/vaults`,
    { headers }
  );

  if (response.status !== HttpStatusCode.Ok) {
    throw "Failed to fetch vaults";
  }

  return response.data;
};

const getVaultContents = async (
  uuid: Uuid,
  privKey: Base64String
): Promise<VaultItem[] | undefined> => {
  const pathStub = "/vaults/" + uuid;
  const privKeyBytes = base64ToBytes(privKey);

  const iv = (await passmanAxios.get(pathStub + "/iv")).data;
  const key = (await passmanAxios.get(pathStub + "/key")).data;
  const content = (await passmanAxios.get(pathStub + "/data")).data;

  const vaultSecretKey = await decryptRSA(privKeyBytes, key);
  const vaultContents = await decryptAES(vaultSecretKey, content, iv);

  const vaultContentsStr = new TextDecoder().decode(vaultContents);
  const { items } = JSON.parse(vaultContentsStr) as {
    items: VaultItem[];
  };

  return items;
};

export { getVaultContents, getVaults };
