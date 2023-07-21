import type { PageLoad } from "./$types";

export const ssr = false;
export const load = (({ params }) => {
  return {
    currentVault: params.vault,
  };
}) satisfies PageLoad;
