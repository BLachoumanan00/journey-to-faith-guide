import { supabase } from "@/integrations/supabase/client";

/** Read a legacy device session without creating new anonymous accounts. */
export async function ensureGuestSession() {
  const { data } = await supabase.auth.getSession();
  return data.session?.user ?? null;
}
