<script lang="ts">
  export let valueName: string;
  export let label: string;

  export let autofocus: boolean | undefined = undefined;
  export let type: "text" | "email" | "password" = "text";

  export let minlength: number | undefined = undefined;
  export let placeholder: string | undefined = undefined;
  export let disabled: boolean | undefined = undefined;
  export let required: boolean | undefined = undefined;
  export let autocomplete:
    | "email"
    | "current-password"
    | "new-password"
    | "one-time-code"
    | "off" = "off";

  export let value: string = "";
</script>

<label
  class="bg-passman-white drop-shadow-md rounded-lg overflow-hidden
           flex flex-col px-3 py-1.5 mx-1
           focus-within:ring-2 ring-passman-blue"
>
  <span class="text-dark-gray text-xs font-semibold lowercase">
    {label}
  </span>

  <input
    class="min-w-0 w-full -mt-0.5
         text-passman-black font-medium
           placeholder:text-light-gray
           disabled:text-gray
           bg-transparent
           border-b-[1px] border-b-light-gray
           focus:outline-none focus:outline-0 focus:outline-transparent"
    name={valueName}
    bind:value
    {...{
      type,
      placeholder,
      minlength,
      autocomplete,
      required,
      disabled,
      autofocus,
    }}
  />
</label>
