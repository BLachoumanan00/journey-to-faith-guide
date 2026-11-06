import { createFileRoute } from "@tanstack/react-router";
import { EmailAuthPage } from "@/components/EmailAuthPage";
import { pageMeta } from "@/lib/page-meta";
export const Route = createFileRoute("/auth")({
  head: () => pageMeta("Connexion — Bible en Main", "Connectez-vous à Bible en Main sans mot de passe, par e-mail ou avec Google."),
  component: EmailAuthPage,
});
