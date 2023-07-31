<script lang="ts">
  import OpenIconicIcon from "./OpenIconicIcon.svelte";
  import type { OpenIconicIconName } from "./OpenIconicIcon.svelte";

  export let title: string;
  export let label: string = "";
  export let iconName: OpenIconicIconName | undefined = undefined;
  export let gray: boolean = false;
  export let iconAfter: boolean = false;
</script>

<button
  aria-label={title}
  {title}
  on:click
  class="hover:bg-hover-tint p-1.5 rounded-md flex items-center gap-2 font-medium"
  class:text-gray={gray}
>
  {#if iconName && !iconAfter}
    <OpenIconicIcon name={iconName} />
  {/if}

  {#if label}
    {label}
  {/if}

  {#if iconName && iconAfter}
    <OpenIconicIcon name={iconName} />
  {/if}
</button>
