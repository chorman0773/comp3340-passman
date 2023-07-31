<script lang="ts">
  export let open: boolean = false;
</script>

<div
  class="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-passman-black/50"
  class:hidden={!open}
>
  <div class="rounded-md shadow-md bg-passman-white">
    <slot />
  </div>
</div>
