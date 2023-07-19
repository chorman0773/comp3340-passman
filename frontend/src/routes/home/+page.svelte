<script lang="ts">
  import Logo from "../../components/Logo.svelte";
  import OpenIconicIcon from "../../components/OpenIconicIcon.svelte";
  import GroupHeading from "../../components/Sidebar/GroupHeading.svelte";
  import GroupItem from "../../components/Sidebar/GroupItem.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  const vaultNames = data.vaults.map((v) => v.name);

  const switchVault = (name: string) => {
    console.log("Changed to " + name);
  };

  const signout = () => {
    console.log("Signout clicked");
  };
</script>

<svelte:head>
  <title>Home | Passman</title>
</svelte:head>

<div id="page-container" class="flex h-screen">
  <div
    id="vault-list"
    class="bg-passman-white drop-shadow-md flex flex-col p-8 gap-3"
  >
    <div id="vault-list-header" class="pb-8">
      <Logo />
    </div>

    <div id="vault-list-contents" class="flex flex-col gap-0.5 flex-grow">
      <GroupHeading>
        Vaults

        <button
          slot="end"
          class="hover:bg-hover-tint text-passman-black -my-1 p-1 rounded-md flex items-center justify-center"
        >
          <OpenIconicIcon name="plus" />
        </button>
      </GroupHeading>
      {#each vaultNames as vaultName}
        <GroupItem>{vaultName}</GroupItem>
      {/each}
    </div>

    <div id="vault-list-footer">
      <button on:click={signout}>Signout!</button>
    </div>
  </div>
</div>
