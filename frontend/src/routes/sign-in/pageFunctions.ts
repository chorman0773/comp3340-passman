import { authenticateUser, parseSecretKey } from "$lib/auth";
import { authState, lastUser, type LastUser } from "$lib/stores";
import { get } from "svelte/store";

const signonFormSubmit = async (
  submitEvent: SubmitEvent,
  isNewUser: boolean,
  cachedUser: LastUser | null,
  onsuccess?: () => any,
  onerror?: () => any
) => {
  const formData = new FormData(submitEvent.target as HTMLFormElement);

  const cachedOrForm = (cacheVal: string, formKey: string) => {
    return isNewUser ? cacheVal : (formData.get(formKey) as string);
  };

  const email = cachedOrForm(cachedUser!.email, "email");
  const secret = cachedOrForm(cachedUser!.secretKey, "secretKey");
  const password = formData.get("password") as string;

  let authResult = undefined;
  try {
    authResult = await authenticateUser(
      email,
      password,
      parseSecretKey(secret)
    );
  } catch {
    console.error("Authentication failed due to cryptographic fault.");
    onerror && onerror();
    return;
  }

  if (!authResult.loggedIn) {
    console.error("Authentication failed.");
    onerror && onerror();
    return;
  }

  // Auth succeeded, cache credentials and store session details
  authState.set(authResult);
  lastUser.set({
    email: email,
    secretKey: secret,
  });

  onsuccess && onsuccess();
};

export { signonFormSubmit };
