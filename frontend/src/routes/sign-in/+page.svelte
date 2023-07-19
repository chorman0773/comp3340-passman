<script lang="ts">
  import { lastUser } from "$lib/lastUserStore";
  import Logo from "../../components/Logo.svelte";
  import OpenIconicIcon from "../../components/OpenIconicIcon.svelte";
  import TextInput from "../../components/TextInput.svelte";
  import type { PageData } from "./$types";

  let email: string;
  let password: string;
  let secretKey: string;

  export let data: PageData;

  let lastUserData = data.lastUserData;
  let changingUsers = false;
  $: returningUserSignin = lastUserData && !changingUsers;

  const formSubmit = async () => {
    const authorized = true;

    if (!authorized) {
      return;
    }

    const newLastUser = returningUserSignin
      ? lastUserData
      : { email, secretKey };

    lastUser.set(newLastUser);
    window.location.pathname = "/home";
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
    id="signin-form"
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

  <button
    type="submit"
    form="signin-form"
    class="bg-passman-blue shadow-sm rounded-xl px-6 py-3 mt-8 text-passman-white"
  >
    <OpenIconicIcon name="lock-unlocked" />
    <span>Unlock</span>
  </button>

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
