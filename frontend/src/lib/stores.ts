import { writable } from "svelte/store";
import { persisted } from "svelte-local-storage-store";
import type { Base64String, Uuid } from "./types";

interface AuthenticationResult {
  loggedIn: boolean;
  userUuid?: Uuid;
  sessionToken?: Base64String;
  privateKey?: Base64String;
}

export interface LastUser {
  email: string;
  secretKey: string; // TODO: this really needs to be encrypted
}

const lastUser = persisted<LastUser | null>("pm_lastUser", null);
const authState = persisted<AuthenticationResult>(
  "pm_authState",
  { loggedIn: false },
  { storage: "session" }
);

export { lastUser, authState };
export type { AuthenticationResult };
