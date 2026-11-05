import { createFileRoute } from "@tanstack/react-router";
import { PhoneAuthPage } from "@/components/PhoneAuthPage";
import { pageMeta } from "@/lib/page-meta";
export const Route = createFileRoute("/_authenticated/changer-telephone")({ head: () => pageMeta("Modifier mon téléphone — Bible en Main", "Vérifiez un nouveau numéro de téléphone pour votre compte Bible en Main."), component: () => <PhoneAuthPage changePhone /> });