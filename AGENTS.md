<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Offline support: vite-plugin-pwa generateSW (sw.js in dist/client), registered only via src/lib/register-sw.ts, which refuses dev/preview/iframe — keeps previews free of stale caches.
- Account operations use authenticated TanStack server functions, with server-only encryption and privileged writes after ownership or role verification — personal data never belongs in public loaders or offline caches.
- Offline runtime caches only public lesson material and Bible lookups; exclude account/auth/admin pages and remove legacy private-data caches — device account changes must not expose another user's data.
- SMS sign-in must fail closed until delivery, CAPTCHA and provider-side verification limits are configured and verified — application limits alone do not secure direct auth API calls.
- Admin contact reads require authenticated server-side role checks before privileged decryption; bulk announcement lists require separate optional consent so registration never implies permission to broadcast.
