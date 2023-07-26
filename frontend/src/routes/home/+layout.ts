import { authData } from "$lib/auth";
import { getVaultContents, getVaults, type Vault } from "$lib/vaults";
import { get } from "svelte/store";
import type { LayoutLoad } from "./$types";
import { goto } from "$app/navigation";

// disable SSR
export const ssr = false;

export interface UserVault {
  id: string;
  key: string;
  name: string;
  itemSummaries: UserItemSummary[];
}

export interface UserItemSummary {
  name: string;
  username: string;
}

interface PageLoadData {
  currentVault?: Vault;
  vaults: Vault[];
}

export const load = (async ({ params }): Promise<PageLoadData> => {
  if (!params.vault) {
    return {
      vaults: getVaults(),
    };
  }

  const authResult = get(authData);
  if (!authResult || !authResult?.authSuccess) {
    throw goto("/sign-in");
  }

  console.log("Auth complete, loading data");

  const vault = await getVaultContents(params.vault, authResult.privateKey!);
  return {
    vaults: getVaults(),
    currentVault: vault,
  };
}) satisfies LayoutLoad;
