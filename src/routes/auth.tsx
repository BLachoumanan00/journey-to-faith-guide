import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, LoaderCircle, ShieldCheck } from "lucide-react";
import type { CountryCode } from "libphonenumber-js/max";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneAccountForm, emptyDetails, normalizedPhone } from "@/components/PhoneAccountForm";
import { BotCheck } from "@/components/BotCheck";
import { phoneAuthConfig, requestPhoneCode, verifyPhoneCode } from "@/lib/account.functions";
import { detailsSchema, RESEND_SECONDS } from "@/lib/account-rules";
import { pageMeta } from "@/lib/page-meta";
import { useLang } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import appIcon from "@/assets/app-icon.png.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => pageMeta("Connexion par SMS — Bible en Main", "Créez votre compte Bible en Main ou retrouvez votre parcours avec un code SMS, sans mot de passe."),
  component: PhoneAuthPage,
});
export function PhoneAuthPage({ changePhone = false }: { changePhone?: boolean }) {
  const { lang, setLang } = useLang(); const fr = lang === "fr";
  const navigate = useNavigate(); const qc = useQueryClient();
  const getConfig = useServerFn(phoneAuthConfig); const send = useServerFn(requestPhoneCode); const verify = useServerFn(verifyPhoneCode);
  const config = useQuery({ queryKey: ["phone-auth-config"], queryFn: () => getConfig() });
  const [details, setDetails] = useState(emptyDetails); const [country, setCountry] = useState<CountryCode>("MU");
  const [errors, setErrors] = useState<Record<string, string>>({}); const [error, setError] = useState("");
  const [captcha, setCaptcha] = useState(""); const [captchaKey, setCaptchaKey] = useState(0);
  const [pending, setPending] = useState(false); const [code, setCode] = useState("");
  const [challenge, setChallenge] = useState<{ id: string; secret: string; expiresAt: string } | null>(null);
  const [cooldown, setCooldown] = useState(0); const [seconds, setSeconds] = useState(300); const [success, setSuccess] = useState(false);
  useEffect(() => { if (!challenge) return; const interval = window.setInterval(() => { setCooldown(v => Math.max(0, v - 1)); setSeconds(Math.max(0, Math.ceil((Date.parse(challenge.expiresAt) - Date.now()) / 1000))); }, 1000); return () => window.clearInterval(interval); }, [challenge]);
  useEffect(() => { if (!success) return; const timer = window.setTimeout(() => navigate({ to: changePhone ? "/profil" : "/parcours", replace: true }), 900); return () => clearTimeout(timer); }, [success, navigate, changePhone]);
  const message = (key: string) => ({
    setup: fr ? "La connexion SMS n'est pas encore disponible. Réessayez plus tard." : "SMS sign-in is not available yet. Please try again later.",
    sms: fr ? "Le SMS n'a pas pu être envoyé. Veuillez réessayer plus tard." : "The SMS could not be sent. Please try again later.",
    captcha: fr ? "Veuillez recommencer la vérification de sécurité." : "Please complete the security check again.",
    limited: fr ? "Trop de demandes. Patientez avant de réessayer." : "Too many requests. Please wait before trying again.",
    expired: fr ? "Code expiré ou cinq tentatives utilisées. Demandez un nouveau code." : "Code expired or five attempts used. Request a new code.",
    code: fr ? "Code incorrect. Veuillez réessayer." : "Incorrect code. Please try again.",
    session: fr ? "Reconnectez-vous pour modifier ce numéro." : "Sign in again to change this number.",
  }[key] ?? (fr ? "Impossible de continuer. Veuillez réessayer." : "Could not continue. Please try again."));
  const requestCode = async () => {
    setError(""); const parsed = detailsSchema.safeParse({ ...details, phone: normalizedPhone(details.phone, country) });
    if (!parsed.success) { const next: Record<string, string> = {}; for (const issue of parsed.error.issues) { const field = String(issue.path[0]); next[field] = field === "phone" ? (fr ? "Saisissez un numéro international valide." : "Enter a valid international number.") : field === "full_name" ? (fr ? "Le nom doit contenir 2 à 80 caractères." : "Name must contain 2–80 characters.") : (fr ? "Ce champ est obligatoire et doit être valide." : "This field is required and must be valid."); } setErrors(next); return; }
    setErrors({}); if (!captcha || !config.data?.ready) { setError(message("setup")); return; }
    setPending(true);
    try { const result = await send({ data: { details: parsed.data, captcha, changePhone } }); if (!result.ok) { setError(message(result.error)); return; } setChallenge(result); setCode(""); setCooldown(RESEND_SECONDS); setSeconds(300); }
    catch { setError(message("unavailable")); }
    finally { setPending(false); setCaptcha(""); setCaptchaKey(k => k + 1); }
  };
  const verifyCode = async () => {
    if (!challenge || !/^\d{4,8}$/.test(code)) { setError(fr ? "Saisissez le code reçu par SMS." : "Enter the code received by SMS."); return; }
    setError(""); setPending(true);
    try { const result = await verify({ data: { ...challenge, code } }); if (!result.ok) { setError(message(result.error) + ("remaining" in result ? ` ${result.remaining} ${fr ? "tentative(s) restante(s)." : "attempt(s) remaining."}` : "")); return; }
      await qc.cancelQueries(); qc.clear(); const session = await supabase.auth.setSession({ access_token: result.access_token, refresh_token: result.refresh_token });
      if (session.error) { setError(message("session")); return; }
      if (!result.transferred) { setError(fr ? "Connecté. Le transfert de votre ancien parcours nécessite notre aide : bibleenmain041@gmail.com." : "Signed in. Your previous journey needs help transferring: bibleenmain041@gmail.com."); return; }
      setSuccess(true);
    } catch { setError(message("unavailable")); } finally { setPending(false); }
  };
  return <div className="mx-auto min-h-screen w-full max-w-md px-5 py-7 sm:px-6 sm:py-10">
    <header className="flex items-center justify-between"><Link to="/" className="flex items-center gap-3"><img src={appIcon.url} alt="" className="size-12 rounded-lg" /><span className="font-serif text-2xl">Bible en Main</span></Link><Button variant="ghost" size="sm" onClick={() => setLang(fr ? "en" : "fr")}>{fr ? "EN" : "FR"}</Button></header>
    <ol className="my-8 flex items-center justify-between gap-2 text-xs text-clay" aria-label={fr ? "Étapes de connexion" : "Sign-in steps"}>{(fr ? ["Vos coordonnées", "Code SMS", "Bienvenue"] : ["Your details", "SMS code", "Welcome"]).map((label, i) => <li key={label} className={`flex items-center gap-2 ${i === (success ? 2 : challenge ? 1 : 0) ? "text-ribbon" : ""}`}><span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-current">{i + 1}</span><span>{label}</span></li>)}</ol>
    {success ? <div className="py-14 text-center"><Check className="mx-auto size-12 text-ribbon" /><h1 className="mt-5 font-serif text-3xl">{fr ? "Bienvenue chez vous" : "Welcome home"}</h1><p className="mt-3 text-sm text-clay">{fr ? "Votre compte est vérifié." : "Your account is verified."}</p></div> : <>
      <h1 className="font-serif text-3xl leading-tight">{challenge ? (fr ? "Vérifiez votre téléphone" : "Verify your phone") : changePhone ? (fr ? "Modifier mon numéro" : "Change my phone number") : (fr ? "Votre parcours commence ici" : "Your journey starts here")}</h1>
      <p className="mt-3 mb-7 text-sm leading-relaxed text-clay">{challenge ? `${fr ? "Un code a été envoyé au numéro se terminant par" : "A code was sent to the number ending in"} ${details.phone.slice(-4)}.` : (fr ? "Retrouvez votre compte ou rejoignez-nous avec votre numéro de téléphone." : "Find your account or join us with your phone number.")}</p>
      {!challenge ? <form noValidate onSubmit={e => { e.preventDefault(); void requestCode(); }} className="space-y-6">
        <PhoneAccountForm value={details} onChange={setDetails} errors={errors} countryCode={country} setCountryCode={setCountry} />
        <div className="space-y-4 border-t border-border pt-5">
          <label className="flex items-start gap-3 text-xs leading-relaxed"><input type="checkbox" checked={details.privacy} onChange={e => setDetails({ ...details, privacy: e.target.checked })} className="mt-0.5 size-4 shrink-0 accent-primary" required /><span>{fr ? "J'ai lu la " : "I have read the "}<Link to={fr ? "/confidentialite" : "/privacy"} target="_blank" rel="noopener noreferrer" className="text-ribbon underline">{fr ? "Politique de confidentialité" : "Privacy Policy"}</Link>{fr ? " et j'accepte que mon nom, mon adresse et mon numéro de téléphone soient collectés pour créer mon compte." : " and agree that my name, address and phone number are collected to create my account."}</span></label>
          {errors['privacy'] && <p className="text-xs text-destructive">{errors['privacy']}</p>}
          <label className="flex items-start gap-3 text-xs leading-relaxed"><input type="checkbox" checked={details.sensitive} onChange={e => setDetails({ ...details, sensitive: e.target.checked })} className="mt-0.5 size-4 shrink-0 accent-primary" required /><span>{fr ? "J'accepte explicitement que mes réponses aux leçons, qui peuvent révéler mes convictions religieuses, soient enregistrées et partagées avec mon mentor si j'en choisis un." : "I explicitly agree that my lesson responses, which may reveal my religious beliefs, are saved and shared with my mentor if I choose one."}</span></label>
          {errors['sensitive'] && <p className="text-xs text-destructive">{errors['sensitive']}</p>}
        </div>
        {config.data?.siteKey && <BotCheck key={captchaKey} siteKey={config.data.siteKey} onToken={setCaptcha} />}
        {config.isPending ? <p className="text-sm text-clay">{fr ? "Vérification de la disponibilité…" : "Checking availability…"}</p> : !config.data?.ready ? <p role="status" className="text-sm text-clay">{message("setup")}</p> : null}
        <Button type="submit" disabled={pending || !config.data?.ready} className="h-12 w-full">{pending ? <LoaderCircle className="animate-spin" /> : <ArrowRight />}{fr ? "Recevoir mon code SMS" : "Send my SMS code"}</Button>
      </form> : <form onSubmit={e => { e.preventDefault(); void verifyCode(); }} className="space-y-5">
        <label htmlFor="sms-code" className="text-sm font-medium">{fr ? "Code de vérification" : "Verification code"}</label><Input id="sms-code" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))} maxLength={8} className="h-14 text-center text-2xl" />
        <p className="text-xs text-clay">{fr ? "Expire dans" : "Expires in"} {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}</p>
        <Button type="submit" className="h-12 w-full" disabled={pending || seconds === 0}>{pending ? <LoaderCircle className="animate-spin" /> : <ShieldCheck />}{fr ? "Vérifier et continuer" : "Verify and continue"}</Button>
        {cooldown === 0 && config.data?.siteKey && <BotCheck key={captchaKey} siteKey={config.data.siteKey} onToken={setCaptcha} />}
        <Button type="button" variant="outline" className="w-full" disabled={pending || cooldown > 0 || !captcha} onClick={() => void requestCode()}>{cooldown > 0 ? `${fr ? "Renvoyer dans" : "Resend in"} ${cooldown}s` : fr ? "Renvoyer le code" : "Resend code"}</Button>
        <Button type="button" variant="ghost" className="w-full" onClick={() => { setChallenge(null); setError(""); setCaptchaKey(k => k + 1); }}><ArrowLeft />{fr ? "Modifier mes coordonnées" : "Edit my details"}</Button>
      </form>}
      {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
      <p className="mt-6 flex items-center justify-center gap-2 text-xs text-clay"><ShieldCheck className="size-4" />{fr ? "Votre vie privée compte." : "Your privacy matters."}</p>
    </>}
  </div>;
}