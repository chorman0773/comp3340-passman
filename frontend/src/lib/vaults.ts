import type { Base64String, Uuid, Vault, VaultItem } from "./types";
import { passmanAxios } from "./auth";
import { base64ToBytes } from "./utilities";
import { HttpStatusCode } from "axios";

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

  const ivBytes = new TextEncoder().encode(iv);
  const vaultKeyBytes = new TextEncoder().encode(key);
  const contentBytes = new TextEncoder().encode(content);

  // TODO; this fails for some reason
  // const vaultSecretKey = await decryptRSA(privKeyBytes, vaultKeyBytes);
  // console.log("Secret key OK");

  // const vaultContents = await decryptAES(vaultSecretKey, contentBytes, ivBytes);
  // console.log("Contents OK");

  // const vaultContentsStr = new TextDecoder().decode(vaultContents);
  // const { items } = JSON.parse(vaultContentsStr) as {
  //   items: VaultItem[];
  // };

  // return items;

  return [
    {
      uuid: "7",
      name: "1Password",
      website: "https://1password.com",
      summaryText: "user@example.com",
      fields: {
        username: "user@example.com",
        password: "examplePassword",
        website: "https://my.1password.ca",
      },
    },
    {
      uuid: "4",
      name: "Figma",
      website: "https://figma.com",
      summaryText: "user@example.com",
      fields: {
        username: "user@example.com",
        password: "examplePassword",
        website: "https://my.1password.ca",
      },
    },
    {
      uuid: "4",
      name: "Figma",
      website: "https://figma.com",
      summaryText: "user@example.com",
      fields: {
        username: "user@example.com",
        password: "examplePassword",
        website: "https://my.1password.ca",
      },
    },
    {
      uuid: "4",
      name: "Figma",
      website: "https://figma.com",
      summaryText: "user@example.com",
      fields: {
        username: "user@example.com",
        password: "examplePassword",
        website: "https://my.1password.ca",
      },
    },
    {
      uuid: "4",
      name: "Figma",
      website: "https://figma.com",
      summaryText: "user@example.com",
      fields: {
        username: "user@example.com",
        password: "examplePassword",
        website: "https://my.1password.ca",
      },
    },
    {
      uuid: "4",
      name: "Figma",
      website: "https://figma.com",
      summaryText: "user@example.com",
      fields: {
        username: "user@example.com",
        password: "examplePassword",
        website: "https://my.1password.ca",
      },
    },
    {
      uuid: "4",
      name: "Figma",
      website: "https://figma.com",
      summaryText: "user@example.com",
      fields: {
        username: "user@example.com",
        password: "examplePassword",
        website: "https://my.1password.ca",
      },
    },
    {
      uuid: "4",
      name: "Figma",
      website: "https://figma.com",
      summaryText: "user@example.com",
      fields: {
        username: "user@example.com",
        password: "examplePassword",
        website: "https://my.1password.ca",
      },
    },
    {
      uuid: "4",
      name: "Figma",
      website: "https://figma.com",
      summaryText: "user@example.com",
      fields: {
        username: "user@example.com",
        password: "examplePassword",
        website: "https://my.1password.ca",
      },
    },
    {
      uuid: "4",
      name: "Figma",
      website: "https://figma.com",
      summaryText: "user@example.com",
      fields: {
        username: "user@example.com",
        password: "examplePassword",
        website: "https://my.1password.ca",
      },
    },
    {
      uuid: "4",
      name: "Figma",
      website: "https://figma.com",
      summaryText: "user@example.com",
      fields: {
        username: "user@example.com",
        password: "examplePassword",
        website: "https://my.1password.ca",
      },
    },
    {
      uuid: "4",
      name: "Figma",
      website: "https://figma.com",
      summaryText: "user@example.com",
      fields: {
        username: "user@example.com",
        password: "examplePassword",
        website: "https://my.1password.ca",
      },
    },
    {
      uuid: "4",
      name: "Figma",
      website: "https://figma.com",
      summaryText: "user@example.com",
      fields: {
        username: "user@example.com",
        password: "examplePassword",
        website: "https://my.1password.ca",
      },
    },
    {
      uuid: "4",
      name: "Figma",
      website: "https://figma.com",
      summaryText: "user@example.com",
      fields: {
        username: "user@example.com",
        password: "examplePassword",
        website: "https://my.1password.ca",
      },
    },
    {
      uuid: "4",
      name: "Figma",
      website: "https://figma.com",
      summaryText: "user@example.com",
      fields: {
        username: "user@example.com",
        password: "examplePassword",
        website: "https://my.1password.ca",
      },
    },
    {
      uuid: "4",
      name: "Figma",
      website: "https://figma.com",
      summaryText: "user@example.com",
      fields: {
        username: "user@example.com",
        password: "examplePassword",
        website: "https://my.1password.ca",
      },
    },
    {
      uuid: "4",
      name: "Figma",
      website: "https://figma.com",
      summaryText: "user@example.com",
      fields: {
        username: "user@example.com",
        password: "examplePassword",
        website: "https://my.1password.ca",
      },
    },
    {
      uuid: "4",
      name: "Figma",
      website: "https://figma.com",
      summaryText: "user@example.com",
      fields: {
        username: "user@example.com",
        password: "examplePassword",
        website: "https://my.1password.ca",
      },
    },
    {
      uuid: "4",
      name: "Figma",
      website: "https://figma.com",
      summaryText: "user@example.com",
      fields: {
        username: "user@example.com",
        password: "examplePassword",
        website: "https://my.1password.ca",
      },
    },
    {
      uuid: "4",
      name: "Figma",
      website: "https://figma.com",
      summaryText: "user@example.com",
      fields: {
        username: "user@example.com",
        password: "examplePassword",
        website: "https://my.1password.ca",
      },
    },
    {
      uuid: "4",
      name: "Figma",
      website: "https://figma.com",
      summaryText: "user@example.com",
      fields: {
        username: "user@example.com",
        password: "examplePassword",
        website: "https://my.1password.ca",
      },
    },
    {
      uuid: "4",
      name: "Figma",
      website: "https://figma.com",
      summaryText: "user@example.com",
      fields: {
        username: "user@example.com",
        password: "examplePassword",
        website: "https://my.1password.ca",
      },
    },
  ];
};

export { getVaultContents, getVaults };
