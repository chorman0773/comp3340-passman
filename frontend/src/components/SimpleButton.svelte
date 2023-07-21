<script lang="ts">
  import OpenIconicIcon from "./OpenIconicIcon.svelte";
  import type { OpenIconicIconName } from "./OpenIconicIcon.svelte";

  export let title: string;
  export let label: string | undefined = undefined;
  export let iconName: OpenIconicIconName | undefined = undefined;
</script>

<button
  aria-label={title}
  {title}
  on:click
  class="hover:bg-hover-tint p-1.5 ms-auto rounded-md flex items-center gap-2 text-passman-black font-medium"
>
  {#if iconName}
    <OpenIconicIcon name={iconName} />
  {/if}

  {#if label}
    {label}
  {/if}
</button>
