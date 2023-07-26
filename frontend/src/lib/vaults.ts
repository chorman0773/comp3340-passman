import type { Uuid } from "./types";

export interface StoredObject {
  uuid: Uuid;
}

export interface Vault extends StoredObject {
  name: string;
  description: string;
  items: VaultItem[];
}

export interface VaultItem extends StoredObject {
  name: string;
  summaryText: string;
  website: string;
  fields: {
    username: string;
    password: string;
    website: string;
  };
}

const VAULTS_STUB: Vault[] = [
  {
    uuid: "1",
    name: "Personal Vault",
    description: "A personal vault, just for you!",
    items: [
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
    ],
  },
  {
    uuid: "3",
    name: "Vaulty McVault Face",
    description: "If you know, you know.",
    items: [
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
    ],
  },
  {
    uuid: "5",
    name: "University of Windsor",
    description:
      "Where lost students go to wander in the shadows of uncertainty and despair.",
    items: [
      {
        uuid: "6",
        name: "Brightspace",
        website: "https://brightspace.uwindsor.ca",
        summaryText: "user@example.com",
        fields: {
          username: "user@example.com",
          password: "examplePassword",
          website: "https://my.1password.ca",
        },
      },
    ],
  },
  {
    uuid: "7",
    name: "Purolator",
    description: "My first coop <3",
    items: [
      {
        uuid: "8",
        name: "1Password",
        website: "https://my.1password.com",
        summaryText: "user@example.com",
        fields: {
          username: "user@example.com",
          password: "examplePassword",
          website: "https://my.1password.ca",
        },
      },
    ],
  },
];

const getVaults = (): Vault[] => {
  return VAULTS_STUB;
};

const getVault = (uuid: Uuid): Vault | undefined => {
  return VAULTS_STUB.find((v) => v.uuid === uuid);
};

export { getVault, getVaults };
