import { writable } from "svelte/store";
import { persisted } from "svelte-local-storage-store";
import type { Base64String, Uuid } from "./types";
import { getLocalStorageJsonValue } from "./utilities";

interface AuthenticationResult {
  loggedIn: boolean;
  sessionToken?: Base64String;
  privateKey?: Base64String;
}

interface Vault {
  name: string;
  uuid: Uuid;
}

interface VaultItem {
  uuid: Uuid;
  name: string;
  summaryText: string;
  website: string;
  fields: {
    username: string;
    password: string;
    website: string;
  };
}

export interface LastUser {
  email: string;
  secretKey: string; // TODO: this really needs to be encrypted
}

const lastUser = persisted<LastUser | null>("pm_lastUser", null);
const authState = writable<AuthenticationResult>({ loggedIn: false });
const vaults = writable<Vault[] | undefined>(undefined);

export { lastUser, authState, vaults };
export type { AuthenticationResult, Vault, VaultItem };
