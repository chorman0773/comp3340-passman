import { browser } from "$app/environment";

export const base64ToBytes = (b64String: string): Uint8Array => {
  return new Uint8Array(
    atob(b64String)
      .split("")
      .map((c) => c.charCodeAt(0))
  );
};

export const bytesToBase64 = (data: Uint8Array): string => {
  const binString = Array.from(data, (x) => String.fromCodePoint(x)).join("");
  return btoa(binString);
};

export const getLocalStorageJsonValue = <T>(key: string): T | null => {
  if (!browser) {
    throw "getLocalStorageJsonValue can only be used in browser environments";
  }

  const storedValue = window.localStorage.getItem(key);
  if (!storedValue) {
    return null;
  }

  return JSON.parse(storedValue) as T | null;
};

export const setLocalStorageJsonValue = <T>(key: string, value: T | null) => {
  if (!browser) {
    throw "setLocalStorageJsonValue can only be used in browser environments";
  }

  if (value === undefined) {
    window.localStorage.removeItem(key);
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};
