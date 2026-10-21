import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPolicy } from "@/components/PrivacyPolicy";
import { pageMeta } from "@/lib/page-meta";
export const Route = createFileRoute("/confidentialite")({ head: () => pageMeta("Politique de confidentialité — Bible en Main", "Vos données personnelles, vos consentements et vos droits dans Bible en Main."), component: () => <PrivacyPolicy lang="fr" /> });