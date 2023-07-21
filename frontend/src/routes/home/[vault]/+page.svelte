<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<svelte:head>
  <title>{data.currentVault} Better Title</title>
</svelte:head>

<h1>This is some page content! Woot!</h1>
