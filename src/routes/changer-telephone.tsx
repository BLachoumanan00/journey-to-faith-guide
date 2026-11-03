import { createFileRoute, redirect } from "@tanstack/react-router";
import { PhoneAuthPage } from "./auth";
import { pageMeta } from "@/lib/page-meta";
import { supabase } from "@/integrations/supabase/client";
export const Route = createFileRoute("/changer-telephone")({ ssr: false, beforeLoad: async () => { const { data } = await supabase.auth.getSession(); if (!data.session?.user.phone || data.session.user.is_anonymous) throw redirect({ to: "/auth" }); }, head: () => pageMeta("Modifier mon téléphone — Bible en Main", "Vérifiez un nouveau numéro de téléphone pour votre compte Bible en Main."), component: () => <PhoneAuthPage changePhone /> });