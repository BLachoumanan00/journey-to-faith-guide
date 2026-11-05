import { createFileRoute } from "@tanstack/react-router";
import { PhoneAuthPage } from "@/components/PhoneAuthPage";
import { pageMeta } from "@/lib/page-meta";
export const Route = createFileRoute("/auth")({
  head: () => pageMeta("Connexion par SMS — Bible en Main", "Créez votre compte Bible en Main ou retrouvez votre parcours avec un code SMS, sans mot de passe."),
  component: PhoneAuthPage,
});
