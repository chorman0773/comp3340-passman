<script lang="ts">
  import type { VaultItem } from "$lib/types";
  import SimpleButton from "../../../components/SimpleButton.svelte";

  export let item: VaultItem;

  const clipboardCopy = (value: string) => {
    navigator.clipboard.writeText(value);
  };
</script>

<div class="flex flex-row items-center gap-4 mb-16">
  <img
    src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,URL,SIZE&size=64&url=${item.website}`}
    class="h-12 rounded-md aspect-square"
    alt={`Favicon of ${item.website}`}
  />

  <h1 class="text-xl font-bold text-passman-black">
    {item.name}
  </h1>

  <span class="text-gray">
    <SimpleButton iconName="pencil" title={"Edit " + item.name} />
  </span>
</div>

<div class="flex flex-col gap-y-2">
  {#each Object.entries(item.fields) as [name, value]}
    <div class="group flex flex-row rounded-md border-[1px] border-light-gray">
      <div class="grow text-left px-3 py-1.5">
        <p class="text-xs font-semibold lowercase text-dark-gray">{name}</p>
        <p class="-mt-0.5 text-passman-black font-medium">{value}</p>
      </div>

      <!-- Copy button -->
      <button
        class="text-left px-3 py-1.5 hidden border-l-[1px] rounded-r-md border-light-gray group-hover:block hover:bg-passman-blue hover:text-white"
        on:click={() => clipboardCopy(value)}
      >
        Copy
      </button>
    </div>
  {/each}
</div>
