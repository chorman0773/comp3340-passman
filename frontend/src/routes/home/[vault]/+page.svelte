<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
  $: vaultName = data.vaults.find((v) => v.uuid === data.currentVault)?.name;
</script>

<svelte:head>
  <title>{vaultName} | Passman</title>
</svelte:head>

<h1>This is some page content! Woot!</h1>
