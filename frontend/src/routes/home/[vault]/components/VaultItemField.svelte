<script lang="ts">
  import OpenIconicIcon from "../../../../components/OpenIconicIcon.svelte";

  export let name: string;
  export let value: string;
  export let masked: boolean = false;
  export let editMode: boolean = false;

  let copied = false;

  const copyClicked = () => {
    navigator.clipboard.writeText(value);

    copied = true;
    setTimeout(() => (copied = false), 1000);
  };
</script>

<div
  class="flex flex-row border-2 rounded-md group border-light-gray hover:bg-hover-tint/5"
>
  <label class="flex flex-col px-2 py-1 mx-1 overflow-hidden grow">
    <span class="text-xs font-semibold lowercase text-dark-gray">
      {name}
    </span>

    {#if masked && !editMode}
      <input
        class="min-w-0 -mt-0.5 text-passman-black font-medium bg-transparent"
        type="password"
        bind:value
        disabled={!editMode}
      />
    {:else}
      <input
        class="min-w-0 -mt-0.5 text-passman-black font-medium bg-transparent"
        type="text"
        bind:value
        disabled={!editMode}
      />
    {/if}
  </label>

  <button
    class:hidden={editMode}
    class="w-0 overflow-hidden font-medium text-left border-light-gray group-hover:border-l-2 focus:border-l-2 group-hover:w-auto focus:w-auto group-hover:overflow-auto focus:overflow-auto"
    on:click={copyClicked}
  >
    <span
      class="flex flex-row items-center gap-2 font-medium hover:bg-passman-blue hover:text-white px-3 py-1.5 h-full rounded-r-md"
    >
      <OpenIconicIcon name="clipboard" />
      {#if copied}
        Copied!
      {:else}
        Copy
      {/if}
    </span>
  </button>
</div>
