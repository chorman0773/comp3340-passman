import { getVault, getVaults, type Vault } from "$lib/vaults";
import type { LayoutLoad } from "./$types";

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

export const load = (({ params }): PageLoadData => {
  return {
    vaults: getVaults(),
    currentVault: params.vault ? getVault(params.vault) : undefined,
  };
}) satisfies LayoutLoad;
