<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Vault } from "$lib/types";
  import Logo from "../../components/Logo.svelte";
  import OpenIconicIcon from "../../components/OpenIconicIcon.svelte";
  import SimpleButton from "../../components/SimpleButton.svelte";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;

  // TODO: make vault data part of a context instead of all localized here.
  // Will allow easier state manipulation and management.

  const switchVault = (uuid: string) => {
    goto("/home/" + uuid);
  };

  const createVault = () => {
    data.vaults = [
      ...data.vaults,
      {
        ...data.vaults[0],
        name: data.vaults[0].name + data.vaults.length,
      },
    ];
  };

  const signout = () => {
    console.log("Signout clicked");
    goto("/sign-in");
  };
</script>

<div id="page-container" class="flex h-screen overflow-hidden">
  <aside
    id={$$props.id ?? "sidebar"}
    class="h-full bg-passman-white shadow-md flex flex-col py-2 gap-1 items-stretch"
  >
    <!-- Heading -->
    <Logo id="sidebar-logo" class="mx-4 mt-4 mb-8 w-56 flex-shrink-0" />

    <!-- Vaults subheading -->
    <div
      id="vault-list-heading"
      class="flex flex-row items-center px-4 text-passman-black"
    >
      <span class="text-xl leading-none font-bold">Vaults</span>
      <SimpleButton title="Add Vault" iconName="plus" on:click={createVault} />
    </div>

    <!-- Main contents -->
    <div class="flex flex-col gap-0.5 overflow-y-auto">
      {#each data.vaults as vault}
        <button
          on:click={() => switchVault(vault.uuid)}
          aria-current={vault.uuid === data?.currentVault}
          class="grow mx-2 px-2 py-1 rounded-md hover:bg-hover-tint aria-[current=true]:bg-hover-tint"
        >
          <p class="text-left text-dark-gray font-medium">
            {vault.name}
          </p>
        </button>
      {/each}
    </div>

    <!-- Footer -->
    <button
      class="mt-auto mx-2 text-passman-black hover:bg-hover-tint rounded-lg font-semibold px-4 py-2 flex flex-row items-center gap-2"
      on:click={signout}
    >
      <OpenIconicIcon name="account-logout" />
      Sign Out
    </button>
  </aside>

  <!-- Page body -->
  <slot />
</div>
