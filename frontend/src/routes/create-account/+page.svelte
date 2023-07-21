<script lang="ts">
  import { goto } from "$app/navigation";
  import SubmitButton from "../../components/Form/SubmitButton.svelte";
  import Logo from "../../components/Logo.svelte";
  import TextInput from "../../components/TextInput.svelte";

  let email: string;
  let password: string;
  let passwordVerify: string;

  const formSubmit = async () => {
    const authorized = true;
    if (authorized) {
      goto("/home");
    }
  };
</script>

<svelte:head>
  <title>Create Account | Passman</title>
</svelte:head>

<div
  id="form-container"
  class="flex flex-col items-center justify-center h-screen"
>
  <div id="logo-container" class="mb-14">
    <Logo />
  </div>

  <form
    id="create-account"
    class="flex flex-col gap-6 max-w-[50ch] w-full"
    on:submit|preventDefault={formSubmit}
  >
    <TextInput
      label="email"
      valueName="email"
      placeholder="user@example.com"
      type="email"
      autocomplete="email"
      required
      bind:value={email}
    />

    <TextInput
      label="password"
      valueName="password"
      type="password"
      placeholder="at least 8 characters"
      autocomplete="new-password"
      required
      bind:value={password}
    />

    <TextInput
      label="re-enter password"
      valueName="passwordVerify"
      type="password"
      placeholder="the same as above"
      autocomplete="new-password"
      required
      bind:value={passwordVerify}
    />
  </form>

  <SubmitButton icon="person" label="Create Account" form="create-account" />

  <div class="text-sm text-dark-gray mt-2">
    <a href="/sign-in">
      Have an account?
      <span class="text-passman-blue">Sign in.</span>
    </a>
  </div>
</div>
