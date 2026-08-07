/**
 * Supabase klijent — povezan na eksterni Supabase projekat.
 * Ključevi se čitaju iz environment promenljivih
 * (VITE_EXT_SUPABASE_URL / VITE_EXT_SUPABASE_PUBLISHABLE_KEY).
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env["VITE_EXT_SUPABASE_URL"] as string;
const supabaseKey = import.meta.env["VITE_EXT_SUPABASE_PUBLISHABLE_KEY"] as string;

function createSupabaseFetch(apiKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }
    // Novi Supabase ključevi nisu JWT-ovi, pa se ne šalju kao Bearer token.
    if (headers.get("Authorization") === `Bearer ${apiKey}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", apiKey);
    return fetch(input, { ...init, headers });
  };
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  global: { fetch: createSupabaseFetch(supabaseKey) },
  auth: {
    storage: typeof window !== "undefined" ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});
