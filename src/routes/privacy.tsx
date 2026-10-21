import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPolicy } from "@/components/PrivacyPolicy";
import { pageMeta } from "@/lib/page-meta";
export const Route = createFileRoute("/privacy")({ head: () => pageMeta("Privacy Policy — Bible en Main", "Your personal information, consent and privacy rights in Bible en Main."), component: () => <PrivacyPolicy lang="en" /> });