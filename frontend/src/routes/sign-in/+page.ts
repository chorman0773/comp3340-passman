import type { LastUser } from "$lib/types";
import { getLocalStorageJsonValue } from "$lib/utilities";
import type { PageLoad } from "./$types";

// pre-fetch the last user data
export const ssr = false;
export const load = (() => {
  return {
    lastUserData: getLocalStorageJsonValue<LastUser | null>("pm_lastUser"),
  };
}) satisfies PageLoad;
