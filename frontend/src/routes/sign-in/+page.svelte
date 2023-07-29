<script lang="ts">
  import { lastUser } from "$lib/stores";
  import { get } from "svelte/store";
  import SubmitButton from "../../components/Form/SubmitButton.svelte";
  import Logo from "../../components/Logo.svelte";
  import TextInput from "../../components/TextInput.svelte";
  import { signonFormSubmit } from "./pageFunctions";
  import { goto } from "$app/navigation";

  // Has this browser signed in before?
  // If so, the secret key and email will exist in browser storage.
  const lastUserData = get(lastUser);
  let returningUser = !!lastUserData;

  // Has authentication been tried and failed?
  let authFailed = false;

  const formSubmit = async function (submitEvent: SubmitEvent) {
    authFailed = false;

    await signonFormSubmit(
      submitEvent,
      returningUser,
      lastUserData,
      authSuccess,
      authFail
    );
  };

  const authSuccess = () => {
    goto("/home");
  };

  const authFail = () => {
    authFailed = true;
  };
</script>

<svelte:head>
  <title>Sign In | Passman</title>
</svelte:head>

<div
  id="form-container"
  class="flex flex-col items-center justify-center h-screen"
>
  <div id="logo-container" class="mb-14">
    <Logo />
  </div>

  <form
    id="signin"
    class="flex flex-col gap-6 max-w-[50ch] w-full"
    on:submit|preventDefault={formSubmit}
  >
    {#if authFailed}
      <div
        class="w-full p-4 py-2 font-medium rounded-md bg-passman-red text-passman-white"
      >
        <span>Invalid credentials. Please try again.</span>
      </div>
    {/if}

    {#if !returningUser}
      <TextInput
        label="email"
        valueName="email"
        placeholder="user@example.com"
        type="email"
        autocomplete="email"
        required
      />
    {/if}

    <TextInput
      label="password"
      valueName="password"
      type="password"
      placeholder="at least 4 characters"
      autocomplete="current-password"
      required
      minlength={4}
    />

    {#if !returningUser}
      <TextInput
        label="secret key"
        valueName="secretKey"
        type="text"
        placeholder="PM-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX"
        autocomplete="off"
        required
      />
    {/if}
  </form>

  <div class="mt-8">
    <SubmitButton icon="lock-unlocked" label="Unlock" form="signin" />
  </div>

  <div class="mt-2 text-sm text-dark-gray">
    {#if returningUser}
      <button on:click={() => (returningUser = false)}>
        Signing in as <span class="font-bold text-passman-black"
          >{lastUserData?.email}</span
        >. Not you?
        <span class="text-passman-blue">Switch accounts.</span>
      </button>
    {:else}
      <a href="/create-account">
        No account?
        <span class="text-passman-blue">Create one!</span>
      </a>
    {/if}
  </div>
</div>
