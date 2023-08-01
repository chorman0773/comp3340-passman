<script lang="ts">
  import type { VaultItem } from "$lib/types";
  import SubmitButton from "../../../../components/Form/SubmitButton.svelte";
  import FullscreenModal from "../../../../components/FullscreenModal.svelte";
  import Logo from "../../../../components/Logo.svelte";
  import OpenIconicIcon from "../../../../components/OpenIconicIcon.svelte";
  import SimpleButton from "../../../../components/SimpleButton.svelte";
  import VaultItemField from "./VaultItemField.svelte";

  export let item: VaultItem;
  export let editMode: boolean = false;
  export let onSaveItem: (newItem: VaultItem) => any;
  export let onDeleteItem: () => any;

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

  let showDeletingOverlay = false;
  const beginDeletingItem = () => {
    showDeletingOverlay = true;
  };

  const endDeletingItem = (confirmed: boolean) => {
    showDeletingOverlay = false;

    if (confirmed) {
      onDeleteItem();
    }
  };
</script>

<FullscreenModal open={showDeletingOverlay}>
  <div class="flex flex-col max-w-full gap-2 p-4 text-left">
    <div class="flex flex-row w-full">
      <h1 class="text-lg font-bold me-auto">
        Are you sure you want to delete {item.name}?
      </h1>
      <SimpleButton
        iconName="x"
        title="Cancel creating item"
        on:click={() => endDeletingItem(false)}
      />
    </div>

    <p class="text-passman-black">
      Please note that this action is
      <span class="font-medium">IRREVERSIBLE</span>!
    </p>

    <div class="mx-auto mt-4 w-fit">
      <button
        on:click={() => endDeletingItem(true)}
        class="flex flex-row items-center gap-3 px-6 py-3 rounded-md shadow-sm text-passman-white bg-passman-red"
      >
        <OpenIconicIcon name="trash" />
        Confirm
      </button>
    </div>
  </div>
</FullscreenModal>

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
      <button
        aria-label="Save"
        title="Save"
        form="editModeForm"
        class="hover:bg-hover-tint p-1.5 rounded-md flex items-center gap-2 font-medium"
        type="submit"
      >
        <OpenIconicIcon name="file" />
        Save
      </button>
    </div>
  </div>
{/if}

<form id="editModeForm" class="p-4" on:submit={() => exitEditMode(true)}>
  <div class="flex flex-row items-center gap-4 mb-16">
    {#if item.website}
      <img
        src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,URL,SIZE&size=64&url=${item.website}`}
        class="h-12 rounded-md aspect-square"
        alt={`Favicon of ${item.website}`}
      />
    {:else}
      <Logo short class="h-12" />
    {/if}

    {#if editMode}
      <input
        type="text"
        class="w-full h-12 min-w-0 text-xl font-bold bg-transparent border-2 rounded-md -ms-2 ps-2 border-light-gray shrink text-passman-black"
        bind:value={item.name}
        required
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

      <span class="text-passman-red ms-auto">
        <SimpleButton
          iconName="trash"
          title={"Delete " + item.name}
          on:click={beginDeletingItem}
        />
      </span>
    {/if}
  </div>

  <div class="flex flex-col gap-y-2">
    {#if editMode || item.fields.username}
      <VaultItemField
        {editMode}
        name="username"
        bind:value={item.fields.username}
      />
    {/if}

    {#if editMode || item.fields.password}
      <VaultItemField
        {editMode}
        name="password"
        bind:value={item.fields.password}
        masked
      />
    {/if}

    {#if editMode || item.fields.website}
      <VaultItemField
        {editMode}
        name="website"
        bind:value={item.fields.website}
      />
    {/if}

    {#if !editMode && !Object.entries(item.fields).some(([ek, ev]) => !!ev)}
      <div class="flex items-center w-full text-gray">
        <SimpleButton
          iconAfter
          iconName="pencil"
          title="Edit"
          label="Edit"
          on:click={enterEditMode}
        />
        <span class="ms-1">this item to start adding fields.</span>
      </div>
    {/if}
  </div>
</form>
