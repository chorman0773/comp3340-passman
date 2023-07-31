<script lang="ts">
  import type { VaultItem } from "$lib/types";
  import { setVaultContents } from "$lib/vaults";
  import SubmitButton from "../../../components/Form/SubmitButton.svelte";
  import OpenIconicIcon from "../../../components/OpenIconicIcon.svelte";
  import SimpleButton from "../../../components/SimpleButton.svelte";
  import type { PageData } from "./$types";
  import VaultItemContents from "./components/VaultItemContents.svelte";
  import { authState } from "$lib/stores";
  import { get } from "svelte/store";
  import Logo from "../../../components/Logo.svelte";
  import FullscreenModal from "../../../components/FullscreenModal.svelte";

  export let data: PageData;
  let { currentVault, vaultContents, vaultSecretKey } = data;
  let { sessionToken, privateKey } = get(authState);

  let selectedItemUuid: string = "";
  $: selectedItem = vaultContents.find((i) => i.uuid === selectedItemUuid)!;

  let itemFilter: string = "";
  $: filteredItems = itemFilter
    ? vaultContents.filter((item) =>
        item.name.toLowerCase().startsWith(itemFilter.toLowerCase())
      )
    : vaultContents;

  $: filteredGroups = filteredItems.reduce((prev, item) => {
    const firstLetter = item.name.charAt(0).toUpperCase();
    prev[firstLetter] ??= [];
    prev[firstLetter].push(item);

    return prev;
  }, {} as { [keyof: string]: VaultItem[] });

  const selectItem = (uuid: string) => {
    selectedItemUuid = uuid;
  };

  let editMode = false;
  let showNewItemOverlay = false;
  let newItemName = "";

  const beginCreatingNewItem = () => {
    showNewItemOverlay = true;
    newItemName = "";
  };

  const endCreatingNewItem = async (save: boolean) => {
    showNewItemOverlay = false;

    if (!save) {
      return;
    }

    const uuid = crypto.randomUUID();
    const newItem: VaultItem = {
      uuid: uuid,
      name: newItemName,
      summaryText: "",
      website: "",
      fields: {
        username: "",
        password: "",
        website: "",
      },
    };

    vaultContents.push(newItem);
    vaultContents = [...vaultContents]; // hack to force re-grouping

    selectedItemUuid = uuid;

    await setVaultContents(
      currentVault!.uuid,
      { sessionToken: sessionToken!, privateKey: privateKey! },
      { secretKey: vaultSecretKey, newContents: vaultContents }
    );
  };

  const newItemSubmitAction = (e: SubmitEvent) => {
    endCreatingNewItem(true);
  };

  const saveUpdatedItem = async (newItem: VaultItem) => {
    const itemIndex = vaultContents.findIndex((i) => i.uuid === newItem.uuid);
    if (itemIndex < 0) {
      console.error("Nonexistent item edited... hrm...");
      return;
    }

    // TODO: implement real persistence
    vaultContents[itemIndex] = newItem;
    newItem.summaryText = newItem.fields.username;
    newItem.website = newItem.fields.website;

    // push data to server (TODO: make this block the user)
    await setVaultContents(
      currentVault!.uuid,
      { sessionToken: sessionToken!, privateKey: privateKey! },
      { secretKey: vaultSecretKey, newContents: vaultContents }
    );
  };
</script>

<svelte:head>
  <title>{currentVault?.name} | Passman</title>
</svelte:head>

<FullscreenModal open={showNewItemOverlay}>
  <div class="flex flex-col max-w-full gap-2 p-4 text-left">
    <div class="flex flex-row w-full">
      <h1 class="text-lg font-bold me-auto">Create New Item</h1>
      <SimpleButton
        iconName="x"
        title="Cancel creating item"
        on:click={() => endCreatingNewItem(false)}
      />
    </div>

    <form on:submit={newItemSubmitAction} id="newItemForm">
      <label
        class="bg-passman-white overflow-hidden
           flex flex-col px-3 py-1.5
            border-2 rounded-md border-light-gray"
      >
        <span class="text-xs font-semibold lowercase text-dark-gray">
          name
        </span>

        <!-- svelte-ignore a11y-autofocus -->
        <input
          class="min-w-0 w-96 -mt-0.5 text-passman-black font-medium
                   bg-transparent"
          name="itemName"
          autofocus
          autocomplete="off"
          type="text"
          bind:value={newItemName}
        />
      </label>

      <div class="mt-4 ms-auto w-fit">
        <SubmitButton icon="file" label="Save" form="newItemForm" />
      </div>
    </form>
  </div>
</FullscreenModal>

<div class="grid grid-rows-[auto_1fr] h-screen max-h-screen px-8 pt-12 pb-4">
  <header class="mb-4">
    <div
      id="titlebar"
      class="flex flex-row gap-3 mb-3 grow justify-content-start"
    >
      <h1 class="text-2xl font-bold">{currentVault?.name}</h1>
      <SimpleButton gray iconName="pencil" title="Edit Vault" />
    </div>
    <p class="text-dark-gray font-medium leading-normal line-clamp-3 h-[72px]">
      {currentVault?.description}
    </p>
  </header>

  <div
    class="bg-passman-white rounded-md shadow-md min-h-0 grid grid-rows-[auto_1fr] grid-cols-[auto_1fr]"
  >
    <header class="flex flex-row col-span-2 border-b-2 border-b-light-gray">
      <div
        id="search"
        class="relative flex flex-row items-center flex-grow gap-2"
      >
        <OpenIconicIcon name="magnifying-glass" class="absolute left-0 mx-2" />
        <label for="itemSearch" class="sr-only"
          >Search {currentVault?.name}</label
        >
        <input
          type="text"
          name="search"
          id="itemSearch"
          class="w-full h-full py-2 font-medium bg-transparent rounded-tl-md ps-8 placeholder:text-dark-gray placeholder:font-medium"
          placeholder={"Search in " + currentVault?.name}
          bind:value={itemFilter}
        />
      </div>

      <button
        aria-label="Add Item"
        title="Add Item"
        on:click={beginCreatingNewItem}
        class="hover:bg-hover-tint px-2 p-1.5 ms-auto rounded-tr-md flex items-center gap-2 font-medium"
      >
        <OpenIconicIcon name="plus" />
        Add Item
      </button>
    </header>

    <aside
      class="w-56 h-full p-2 overflow-x-hidden overflow-y-auto border-r-2 border-r-light-gray"
    >
      {#each Object.entries(filteredGroups).sort( (a, b) => a[0].localeCompare(b[0]) ) as [sharedPrefix, items]}
        <p class="px-2 mt-2 font-bold text-gray">{sharedPrefix}</p>

        {#each items.sort((a, b) => a.name.localeCompare(b.name)) as item}
          <button
            class="mb-1 rounded-md p-2 flex w-full flex-row gap-2.5 items-center aria-[current=true]:bg-hover-tint"
            aria-current={selectedItemUuid === item.uuid}
            on:click={() => selectItem(item.uuid)}
            class:hover:bg-hover-tint={!editMode}
            disabled={editMode}
          >
            {#if item.website}
              <!-- TODO: we have no way to detect this failing, so we need a proper service for this. Also the 
                           Passman Logo shouldn't be used as a placeholder when the icon doesn't exist. Instead 
                           we should use an "initials" icon 
                -->
              <img
                src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,URL,SIZE&size=64&url=${item.website}`}
                class="rounded-md aspect-square h-7"
                alt={`Favicon of ${item.website}`}
              />
            {:else}
              <Logo short class="h-7" />
            {/if}
            <div class="min-w-0 text-left">
              <p class="-mb-1 font-semibold truncate text-passman-black">
                {item.name}
              </p>
              <p class="text-xs font-semibold truncate text-gray">
                {item.summaryText}
              </p>
            </div>
          </button>
        {/each}
      {/each}
    </aside>

    <main>
      {#if !selectedItemUuid || !filteredItems.find((i) => i.uuid === selectedItemUuid)}
        <div
          class="flex flex-row items-center justify-center w-full h-full gap-4 p-4 text-3xl font-bold grow text-gray"
        >
          <OpenIconicIcon name="arrow-thick-left" />
          <span> Select an item to view its contents. </span>
        </div>
      {:else}
        <VaultItemContents
          item={JSON.parse(JSON.stringify(selectedItem))}
          onSaveItem={saveUpdatedItem}
          bind:editMode
        />
      {/if}
    </main>
  </div>
</div>
