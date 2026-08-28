import { createFileRoute, Outlet } from "@tanstack/react-router";

import { ensureGuestSession } from "@/lib/guest";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const user = await ensureGuestSession();
    return { user };
  },
  component: () => <Outlet />,
});
