<script lang="ts">
  import { goto } from "$app/navigation";
  import { authenticateUser } from "$lib/auth";
  import { lastUser } from "$lib/lastUserStore";
  import SubmitButton from "../../components/Form/SubmitButton.svelte";
  import Logo from "../../components/Logo.svelte";
  import TextInput from "../../components/TextInput.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  let email: string;
  let password: string;
  let secretKey: string;

  let lastUserData = data.lastUserData;
  let changingUsers = false;
  $: returningUserSignin = lastUserData && !changingUsers;

  const formSubmit = async () => {
    const { authSuccess } = await authenticateUser(email, password, secretKey);

    // HACK: you should really really REALLY check this...
    // https://youtu.be/y4GB_NDU43Q

    // if (!authSuccess) {
    //   return;
    // }

    const newLastUser = returningUserSignin
      ? lastUserData
      : { email, secretKey };

    lastUser.set(newLastUser);
    goto("/home");
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
    {#if !returningUserSignin}
      <TextInput
        label="email"
        valueName="email"
        placeholder="user@example.com"
        type="email"
        autocomplete="email"
        required
        bind:value={email}
      />
    {:else}
      <div class="text-center text-dark-gray">
        Signing in as
        <span class="text-passman-black font-bold">{lastUserData?.email}</span>
      </div>
    {/if}

    <TextInput
      label="password"
      valueName="password"
      type="password"
      placeholder="at least 8 characters"
      autocomplete="current-password"
      required
      minlength={8}
      bind:value={password}
    />

    {#if !returningUserSignin}
      <TextInput
        label="secret key"
        valueName="secretKey"
        type="text"
        placeholder="PM-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX"
        autocomplete="off"
        required
        bind:value={secretKey}
      />
    {/if}
  </form>

  <SubmitButton icon="lock-unlocked" label="Unlock" form="signin" />

  <div class="mt-2 text-sm text-dark-gray">
    {#if !returningUserSignin}
      <a href="/create-account">
        No account?
        <span class="text-passman-blue">Create one!</span>
      </a>
    {:else}
      <button on:click={() => (changingUsers = true)}>
        Not you?
        <span class="text-passman-blue">Switch accounts.</span>
      </button>
    {/if}
  </div>
</div>