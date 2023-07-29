<script lang="ts">
  export let valueName: string;
  export let label: string;

  export let autofocus: boolean = false;
  export let type: "text" | "email" | "password" = "text";

  export let minlength: number | undefined = undefined;
  export let placeholder: string = "";
  export let disabled: boolean = false;
  export let required: boolean = false;
  export let autocomplete:
    | "email"
    | "current-password"
    | "new-password"
    | "one-time-code"
    | "off" = "off";

  export let value: string = "";
</script>

<label
  class="bg-passman-white rounded-md overflow-hidden
           flex drop-shadow-md flex-col px-3 py-1.5 mx-1
           focus-within:ring-2 ring-passman-blue"
>
  <span class="text-xs font-semibold lowercase text-dark-gray">
    {label}
  </span>

  <input
    class="min-w-0 w-full -mt-0.5
         text-passman-black font-medium border-b-[1px]
           placeholder:text-light-gray border-b-light-gray
           bg-transparent
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
