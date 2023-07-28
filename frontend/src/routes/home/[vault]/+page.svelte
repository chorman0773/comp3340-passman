<script lang="ts">
  import type { VaultItem } from "$lib/types";
  import OpenIconicIcon from "../../../components/OpenIconicIcon.svelte";
  import SimpleButton from "../../../components/SimpleButton.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  const { currentVault, vaultContents } = data;

  let selectedItemUuid: string | undefined = undefined;
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
</script>

<svelte:head>
  <title>{currentVault?.name} | Passman</title>
</svelte:head>

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
    <header class="border-b-light-gray border-b-[1px] flex flex-row col-span-2">
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
        on:click
        class="hover:bg-hover-tint px-2 p-1.5 ms-auto rounded-tr-md flex items-center gap-2 font-medium"
      >
        <OpenIconicIcon name="plus" />
        Add Item
      </button>
    </header>

    <aside
      class="h-full w-56 overflow-y-auto overflow-x-hidden p-2 border-r-[1px] border-r-light-gray"
    >
      {#each Object.entries(filteredGroups) as [sharedPrefix, items]}
        <p class="px-2 font-bold text-gray">{sharedPrefix}</p>

        {#each items as item}
          <button
            class="mb-1 rounded-md p-2 flex w-full flex-row gap-2.5 items-center hover:bg-hover-tint aria-[current=true]:bg-hover-tint"
            aria-current={selectedItemUuid === item.uuid}
            on:click={() => (selectedItemUuid = item.uuid)}
          >
            <img
              src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,URL,SIZE&size=64&url=${item.website}`}
              class="rounded-md aspect-square h-7"
              alt={`Favicon of ${item.website}`}
            />
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

    <main>Content</main>
  </div>
</div>
