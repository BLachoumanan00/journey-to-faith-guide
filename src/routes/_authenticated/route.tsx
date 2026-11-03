import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";
import { POLICY_VERSION } from "@/lib/account-rules";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (!user || user.is_anonymous || !user.phone) throw redirect({ to: "/auth" });
    const account = await supabase.from("users").select("id, policy_version").eq("id", user.id).maybeSingle();
    if (account.error) throw new Error("Compte temporairement indisponible");
    if (!account.data || account.data.policy_version !== POLICY_VERSION) throw redirect({ to: "/auth" });
    return { user };
  },
  component: () => <Outlet />,
});
