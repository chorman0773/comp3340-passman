<script lang="ts">
  import { goto } from "$app/navigation";
  import { signOut } from "$lib/auth";
  import { authState } from "$lib/stores";
  import { get } from "svelte/store";
  import Logo from "../../components/Logo.svelte";
  import OpenIconicIcon from "../../components/OpenIconicIcon.svelte";
  import SimpleButton from "../../components/SimpleButton.svelte";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;

  const switchVault = (uuid: string) => goto("/home/" + uuid);
  const createVault = () => console.log("createVault: todo!");
</script>

<div id="page-container" class="flex flex-row h-screen max-h-screen">
  <aside
    id={$$props.id ?? "sidebar"}
    class="flex flex-col items-stretch h-full gap-1 py-2 shadow-md bg-passman-white"
  >
    <!-- Heading -->
    <Logo id="sidebar-logo" class="flex-shrink-0 w-56 mx-4 mt-4 mb-8" />

    <!-- Vaults subheading -->
    <div
      id="vault-list-heading"
      class="flex flex-row items-center px-4 text-passman-black"
    >
      <span class="text-xl font-bold leading-none me-auto">Vaults</span>
      <SimpleButton title="Add Vault" iconName="plus" on:click={createVault} />
    </div>

    <!-- Main contents -->
    <div class="flex flex-col gap-0.5 overflow-y-auto">
      {#each data.vaults as vault}
        <button
          on:click={() => switchVault(vault.uuid)}
          aria-current={vault.uuid === data.currentVault?.uuid}
          class="grow mx-2 px-2 py-1 rounded-md hover:bg-hover-tint aria-[current=true]:bg-hover-tint"
        >
          <p class="font-medium text-left text-dark-gray">
            {vault.name}
          </p>
        </button>
      {/each}
    </div>

    <!-- Footer -->
    <button
      class="flex flex-row items-center gap-2 px-4 py-2 mx-2 mt-auto font-semibold rounded-lg text-passman-black hover:bg-hover-tint"
      on:click={() => signOut(get(authState).sessionToken)}
    >
      <OpenIconicIcon name="account-logout" />
      Sign Out
    </button>
  </aside>

  <!-- Page body -->
  <div class="w-full">
    <slot />
  </div>
</div>
