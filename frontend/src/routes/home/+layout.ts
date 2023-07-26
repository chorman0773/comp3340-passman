import { authState } from "$lib/stores";
import { get } from "svelte/store";
import type { LayoutLoad } from "./$types";
import { goto } from "$app/navigation";
import { getVaults } from "$lib/vaults";

interface PageLoadData {}

export const load = (async ({ params }): Promise<PageLoadData> => {
  // is the user signed in?
  const currentAuthState = get(authState);

  if (!currentAuthState.loggedIn) {
    await goto("/sign-in");
    throw "YOU SHALL NOT PASS! (User not signed in, sending to /sign-in)";
  }

  console.log(currentAuthState);
  const { userUuid, sessionToken } = currentAuthState;
  console.log({
    userUuid,
    sessionToken,
  });

  // load vaults
  const vaults = await getVaults(userUuid!, sessionToken!);

  return {};
}) satisfies LayoutLoad;
