import { redirect } from "@sveltejs/kit";

// redirect / to /sign-in
export function load() {
  throw redirect(308, "/sign-in");
}
