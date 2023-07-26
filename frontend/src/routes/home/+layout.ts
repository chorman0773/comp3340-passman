import { authState } from "$lib/stores";
import { get } from "svelte/store";
import { goto } from "$app/navigation";
import { getVaults } from "$lib/vaults";
import type { LayoutLoad } from "./$types";
import type { Uuid, Vault } from "$lib/types";

interface PageLoadData {
  vaults: Vault[];
  currentVaultUuid: Uuid | undefined;
}

export const load = (async ({ params }): Promise<PageLoadData> => {
  // is the user signed in?
  const currentAuthState = get(authState);

  if (!currentAuthState.loggedIn) {
    await goto("/sign-in");
    throw "YOU SHALL NOT PASS! (User not signed in, sending to /sign-in)";
  }

  const { userUuid, sessionToken } = currentAuthState;
  if (!userUuid || !sessionToken) {
    await goto("/sign-in");
    throw "YOU SHALL NOT PASS! (Invalid auth state, sending to /sign-in)";
  }

  // load vaults
  const vaults = await getVaults(userUuid, sessionToken);
  return {
    vaults: vaults,
    currentVaultUuid: params.vault,
  };
}) satisfies LayoutLoad;
