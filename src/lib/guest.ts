import { supabase } from "@/integrations/supabase/client";

/**
 * The app has no login screen: every visitor gets a silent guest session so
 * their answers, notes and progress can still be stored and read back.
 */
export async function ensureGuestSession() {
  const { data } = await supabase.auth.getSession();
  if (data.session?.user) return data.session.user;

  const { data: created, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return created.user ?? null;
}
