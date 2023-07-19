import type { LastUser } from "./types";
import { persisted } from "svelte-local-storage-store";

const store = persisted<LastUser | null>("pm_lastUser", null);

export { store as lastUser };
