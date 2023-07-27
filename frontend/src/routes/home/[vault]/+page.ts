import { goto } from "$app/navigation";
import { authState } from "$lib/stores";
import { getVaultContents } from "$lib/vaults";
import { get } from "svelte/store";
import type { PageLoad } from "./$types";
import type { VaultItem } from "$lib/types";

interface PageLoadData {
  vaultContents: VaultItem[];
}

export const load = (async ({ parent }): Promise<PageLoadData> => {
  // Before we await our parent's data, lets at least make sure we have the cred we need
  const { loggedIn, sessionToken, privateKey } = get(authState);
  if (!loggedIn || !privateKey || !sessionToken) {
    await goto("/sign-in");
    return {} as unknown as PageLoadData;
  }

  const { currentVault } = await parent();
  if (!currentVault) {
    goto("/home");
    return {} as unknown as PageLoadData;
  }

  try {
    // We have a valid vault. Pwetty pwease Mw. Backend, couwwd i have the data? UwU
    return {
      vaultContents: await getVaultContents(
        currentVault!.uuid,
        sessionToken,
        privateKey
      ),
    };
  } catch (e) {
    await goto("/home");
    throw e;
  }
}) satisfies PageLoad;
