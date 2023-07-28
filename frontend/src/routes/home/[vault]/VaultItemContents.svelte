<script lang="ts">
  import type { VaultItem } from "$lib/types";
  import OpenIconicIcon from "../../../components/OpenIconicIcon.svelte";
  import SimpleButton from "../../../components/SimpleButton.svelte";

  export let item: VaultItem;

  const clipboardCopy = (event: MouseEvent, value: string) => {
    navigator.clipboard.writeText(value);
  };
</script>

<div class="flex flex-row items-center gap-4 mb-16">
  <img
    src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,URL,SIZE&size=64&url=${item.website}`}
    class="h-12 rounded-md aspect-square"
    alt={`Favicon of ${item.website}`}
  />

  <h1 class="text-xl font-bold truncate text-passman-black">
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
        class="text-left border-l-[1px] font-medium border-light-gray w-0 overflow-hidden group-hover:w-auto focus:w-auto group-hover:overflow-auto focus:overflow-auto"
        on:click={(e) => clipboardCopy(e, value)}
      >
        <span
          class="flex flex-row items-center gap-2 font-medium hover:bg-passman-blue hover:text-white px-3 py-1.5 h-full rounded-r-md"
        >
          <OpenIconicIcon name="clipboard" />
          Copy
        </span>
      </button>
    </div>
  {/each}
</div>
