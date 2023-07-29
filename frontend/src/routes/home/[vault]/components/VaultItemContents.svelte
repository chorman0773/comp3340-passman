<script lang="ts">
  import type { VaultItem } from "$lib/types";
  import SimpleButton from "../../../../components/SimpleButton.svelte";
  import VaultItemField from "./VaultItemField.svelte";

  export let item: VaultItem;
  export let editMode: boolean = false;
  export let onSaveItem: (newItem: VaultItem) => any;

  let originalItem = JSON.parse(JSON.stringify(item));

  const enterEditMode = () => {
    originalItem = JSON.parse(JSON.stringify(item));
    editMode = true;
  };

  const exitEditMode = (saveChanges: boolean) => {
    editMode = false;

    if (saveChanges) {
      onSaveItem(item);
    } else {
      item = originalItem;
    }
  };
</script>

{#if editMode}
  <div
    class="flex flex-row items-center w-full gap-4 px-4 py-2 mb-4 font-bold truncate text-passman-white bg-passman-blue"
  >
    <span class="me-auto">You are editing this item.</span>
    <div class="border-2 rounded-md border-passman-white">
      <SimpleButton
        iconName="ban"
        title="Cancel"
        label="Cancel"
        on:click={() => exitEditMode(false)}
      />
    </div>
    <div class="border-2 rounded-md border-passman-white">
      <SimpleButton
        iconName="file"
        title="Save"
        label="Save"
        on:click={() => exitEditMode(true)}
      />
    </div>
  </div>
{/if}

<div class="p-4">
  <div class="flex flex-row items-center gap-4 mb-16">
    <img
      src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,URL,SIZE&size=64&url=${item.website}`}
      class="h-12 rounded-md aspect-square"
      alt={`Favicon of ${item.website}`}
    />

    {#if editMode}
      <input
        type="text"
        class="w-full h-12 min-w-0 text-xl font-bold bg-transparent border-2 rounded-md -ms-2 ps-2 border-passman-blue shrink text-passman-black"
        bind:value={item.name}
      />
    {:else}
      <span class="text-lg font-bold text-passman-black">{item.name}</span>
      <span class="text-gray">
        <SimpleButton
          iconName="pencil"
          title={"Edit " + item.name}
          on:click={enterEditMode}
        />
      </span>
    {/if}
  </div>

  <div class="flex flex-col gap-y-2">
    <VaultItemField
      {editMode}
      name="username"
      bind:value={item.fields.username}
    />
    <VaultItemField
      {editMode}
      name="password"
      bind:value={item.fields.password}
      masked
    />
    <VaultItemField
      {editMode}
      name="website"
      bind:value={item.fields.website}
    />
  </div>
</div>
