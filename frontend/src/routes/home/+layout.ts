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
  const { loggedIn, userUuid, sessionToken } = get(authState);

  if (!loggedIn || !userUuid || !sessionToken) {
    // await goto("/sign-in");
    // return EMPTY_DATA;
  }

  // load vaults
  const vaults = await getVaults(userUuid!, sessionToken!);
  const currentVault = vaults.find((v) => v.uuid === params.vault);

  if (params.vault && !currentVault) {
    await goto("/home");
    return EMPTY_DATA;
  }

  return {
    vaults: vaults,
    currentVault: currentVault,
  };
}) satisfies LayoutLoad;
