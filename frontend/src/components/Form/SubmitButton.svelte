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
  class="text-passman-white bg-passman-blue shadow-sm rounded-xl px-6 py-3 mt-8 flex flex-row gap-3 items-center"
>
  {#if icon}
    <OpenIconicIcon name={icon} />
  {/if}

  {label}
</button>
