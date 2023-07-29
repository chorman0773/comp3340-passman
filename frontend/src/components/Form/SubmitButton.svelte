<script lang="ts">
  import type { OpenIconicIconName } from "../OpenIconicIcon.svelte";
  import OpenIconicIcon from "../OpenIconicIcon.svelte";

  export let icon: OpenIconicIconName | undefined = undefined;
  export let label: string;
  export let form: string | undefined;
</script>

<button
  {form}
  type="submit"
  class="flex flex-row items-center gap-3 px-6 py-3 rounded-md shadow-sm text-passman-white bg-passman-blue"
>
  {#if icon}
    <OpenIconicIcon name={icon} />
  {/if}

  {label}
</button>
