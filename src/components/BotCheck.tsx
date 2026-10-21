import { useEffect, useRef } from "react";
type Turnstile = { render: (element: HTMLElement, options: Record<string, unknown>) => string; remove: (id: string) => void };
export function BotCheck({ siteKey, onToken }: { siteKey: string; onToken: (token: string) => void }) {
  const element = useRef<HTMLDivElement>(null);
  const callback = useRef(onToken); callback.current = onToken;
  useEffect(() => {
    let widget: string | undefined; let active = true;
    const get = () => (window as unknown as { turnstile?: Turnstile }).turnstile;
    const render = () => { const api = get(); if (!active || widget || !api || !element.current) return; widget = api.render(element.current, { sitekey: siteKey, theme: "dark", size: "flexible", callback: (token: string) => callback.current(token), "expired-callback": () => callback.current(""), "error-callback": () => callback.current("") }); };
    let script = document.querySelector<HTMLScriptElement>('script[data-bible-turnstile]');
    if (!script) { script = document.createElement("script"); script.dataset['bibleTurnstile'] = "true"; script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"; script.async = true; document.head.appendChild(script); }
    script.addEventListener("load", render); render();
    return () => { active = false; script?.removeEventListener("load", render); if (widget) get()?.remove(widget); };
  }, [siteKey]);
  return <div ref={element} className="min-h-16 w-full" />;
}