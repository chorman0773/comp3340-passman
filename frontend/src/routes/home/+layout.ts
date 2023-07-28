import { authState } from "$lib/stores";
import { get } from "svelte/store";
import { goto } from "$app/navigation";
import { getVaults } from "$lib/vaults";
import type { LayoutLoad } from "./$types";
import type { Vault } from "$lib/types";

const EMPTY_DATA = {
  vaults: [],
};

interface LayoutLoadData {
  vaults: Vault[];
  currentVault?: Vault;
}

export const load = (async ({ params }): Promise<LayoutLoadData> => {
  // is the user signed in?
  const currentAuthState = get(authState);
  const { userUuid, sessionToken } = currentAuthState;

  if (!currentAuthState.loggedIn || !userUuid || !sessionToken) {
    await goto("/sign-in");
    return EMPTY_DATA;
  }

  // TODO: for when session timeout and {GET,DELETE} /auth/current-session exist
  // await checkSession(sessionToken);

  // load vaults
  const vaults = await getVaults(userUuid, sessionToken);
  const currentVault = vaults.find((v) => v.uuid === params.vault);

  if (params.vault && !currentVault) {
    await goto("/home");
    return EMPTY_DATA;
  }

  console.log({
    vaults: vaults,
    currentVault: currentVault,
  });

  return {
    vaults: vaults,
    currentVault: currentVault,
  };
}) satisfies LayoutLoad;
