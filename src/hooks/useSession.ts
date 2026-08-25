import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

export function useSessionUser() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, ready };
}

/** Ensures a profile row exists for the signed-in user, then returns it. */
export function useProfile(userId?: string) {
  return useQuery({
    queryKey: ["profile", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, preferred_lang, invite_code, reminders_enabled")
        .eq("id", userId!)
        .maybeSingle();
      if (error) throw error;
      if (data) return data;

      const { data: created, error: insertError } = await supabase
        .from("profiles")
        .insert({ id: userId! })
        .select("id, display_name, preferred_lang, invite_code, reminders_enabled")
        .single();
      if (insertError) throw insertError;
      await supabase.from("user_roles").insert({ user_id: userId!, role: "seeker" });
      return created;
    },
  });
}

export function useRoles(userId?: string) {
  return useQuery({
    queryKey: ["roles", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId!);
      if (error) throw error;
      return (data ?? []).map((r) => r.role as "seeker" | "mentor" | "admin");
    },
  });
}
