/**
 * Centralna konfiguracija Supabase (Lovable Cloud) klijenta.
 * Ključevi se čitaju iz environment promenljivih (VITE_SUPABASE_URL /
 * VITE_SUPABASE_PUBLISHABLE_KEY) — ništa nije hardkodovano u kodu.
 */
export { supabase } from "@/integrations/supabase/client";
export type { Database } from "@/integrations/supabase/types";
