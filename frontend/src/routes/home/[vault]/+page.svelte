<script lang="ts">
  import type { VaultItem } from "$lib/vaults";
  import OpenIconicIcon from "../../../components/OpenIconicIcon.svelte";
  import SimpleButton from "../../../components/SimpleButton.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  type GroupedVaultItems = { [keyof: string]: VaultItem[] };

  $: itemGroups = ((items: VaultItem[]): GroupedVaultItems => {
    const result: GroupedVaultItems = {};

    for (const item of items) {
      const index = item.name.charAt(0).toUpperCase();
      result[index] ??= [];
      result[index].push(item);
    }

    return result;
  })(data.currentVault?.items ?? []);

  let selectedItemUuid = "";

  $: selectedItem = data.currentVault?.items.find(
    (i) => i.uuid === selectedItemUuid
  );
</script>

<svelte:head>
  <title>{data.currentVault?.name} | Passman</title>
</svelte:head>

<div class="px-8 pt-12 pb-4 flex flex-col flex-grow">
  <header class="mb-4">
    <div
      id="titlebar"
      class="flex flex-row grow gap-3 mb-3 justify-content-start"
    >
      <h1 class="text-2xl font-bold">{data.currentVault?.name}</h1>
      <SimpleButton gray iconName="pencil" title="Edit Vault" />
    </div>
    <p class="text-dark-gray font-medium leading-normal line-clamp-3 h-[72px]">
      {data.currentVault?.description}
    </p>
  </header>

  <main
    class="rounded-lg bg-passman-white drop-shadow-md flex flex-col flex-grow overflow-hidden"
  >
    <header class="border-b-light-gray border-b-[1px] flex flex-row flex-none">
      <div
        id="search"
        class="relative flex-grow flex flex-row gap-2 items-center"
      >
        <OpenIconicIcon name="magnifying-glass" class="absolute left-0 mx-2" />
        <label for="itemSearch" class="sr-only"
          >Search {data.currentVault?.name}</label
        >
        <input
          type="text"
          name="search"
          id="itemSearch"
          class="bg-transparent w-full rounded-tl-lg ps-8 py-2 placeholder:text-dark-gray placeholder:font-medium font-medium"
          placeholder={"Search in " + data.currentVault?.name}
        />
      </div>

      <button
        aria-label="Add Item"
        title="Add Item"
        on:click
        class="hover:bg-hover-tint px-2 p-1.5 ms-auto rounded-tr-lg flex items-center gap-2 font-medium"
      >
        <OpenIconicIcon name="plus" />
        Add Item
      </button>
    </header>

    <div class="flex flex-row flex-grow min-h-0">
      <aside
        class="h-full flex flex-col gap-0.5 overflow-auto p-2 border-r-[1px] border-r-light-gray min-w-fit"
      >
        {#each Object.entries(itemGroups) as [sharedPrefix, items]}
          <p class="font-bold text-gray px-2">{sharedPrefix}</p>

          {#each items as item}
            <button
              class=" rounded-lg p-2 flex flex-row gap-2.5 items-center hover:bg-hover-tint aria-[current=true]:bg-hover-tint"
              aria-current={selectedItemUuid === item.uuid}
              on:click={() => (selectedItemUuid = item.uuid)}
            >
              <img
                src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,URL,SIZE&size=64&url=${item.website}`}
                class="aspect-square h-7 rounded-md"
                alt={`Favicon of ${item.website}`}
              />
              <div class="text-left">
                <p class="font-semibold text-passman-black -mb-1">
                  {item.name}
                </p>
                <p class="font-semibold text-xs text-gray">
                  {item.summaryText}
                </p>
              </div>
            </button>
          {/each}
        {/each}
      </aside>

      <main class="py-3 px-6 w-full">
        {#if selectedItemUuid}
          <div
            id="itemheader"
            class="flex flex-row justify-start items-center gap-3 self-stretch"
          >
            <img
              src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,URL,SIZE&size=64&url=${selectedItem?.website}`}
              class="aspect-square h-12 rounded-md"
              alt={`Favicon of ${selectedItem?.website}`}
            />

            <h1 class="text-passman-black text-xl font-bold">
              {selectedItem?.name}
            </h1>

            <SimpleButton
              iconName="pencil"
              title={"Edit " + selectedItem?.name}
            />
          </div>
        {:else}
          <div
            class="flex flex-row w-full text-center gap-4 mt-4 justify-center grow text-3xl text-gray font-bold"
          >
            <OpenIconicIcon name="arrow-thick-left" />
            <span> Select an item to view its contents. </span>
          </div>
        {/if}
      </main>
    </div>
  </main>
</div>
