import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, LoaderCircle, Mail, ShieldCheck } from "lucide-react";
import type { CountryCode } from "libphonenumber-js/max";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneAccountForm, emptyDetails, normalizedPhone } from "@/components/PhoneAccountForm";
import { completeProfile, touchLogin } from "@/lib/account.functions";
import { detailsSchema, POLICY_VERSION, RESEND_SECONDS } from "@/lib/account-rules";
import { useLang } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import appIcon from "@/assets/app-icon.png.asset.json";

const GUEST_KEY = "bem-guest-token";
type Step = "checking" | "signin" | "code" | "details" | "done";

async function rememberGuest() {
  const { data } = await supabase.auth.getSession();
  if (data.session?.user.is_anonymous) sessionStorage.setItem(GUEST_KEY, data.session.access_token);
}

function GoogleLogo() {
  return <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>;
}

export function EmailAuthPage() {
  const { lang, setLang } = useLang(); const fr = lang === "fr";
  const navigate = useNavigate(); const qc = useQueryClient();
  const complete = useServerFn(completeProfile); const touch = useServerFn(touchLogin);
  const [step, setStep] = useState<Step>("checking");
  const [email, setEmail] = useState(""); const [code, setCode] = useState("");
  const [details, setDetails] = useState(emptyDetails); const [country, setCountry] = useState<CountryCode>("MU");
  const [errors, setErrors] = useState<Record<string, string>>({}); const [error, setError] = useState("");
  const [pending, setPending] = useState(false); const [cooldown, setCooldown] = useState(0);

  const route = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user || user.is_anonymous) { setStep("signin"); return; }
    const account = await supabase.from("users").select("id, policy_version").eq("id", user.id).maybeSingle();
    if (account.data && account.data.policy_version === POLICY_VERSION) {
      void touch().catch(() => undefined); setStep("done"); return;
    }
    const name = typeof user.user_metadata?.["full_name"] === "string" ? user.user_metadata["full_name"] : "";
    setDetails(d => ({ ...d, full_name: d.full_name || name })); setStep("details");
  }, [touch]);

  useEffect(() => { void route(); }, [route]);
  useEffect(() => { const { data } = supabase.auth.onAuthStateChange(e => { if (e === "SIGNED_IN") void route(); }); return () => data.subscription.unsubscribe(); }, [route]);
  useEffect(() => { if (cooldown <= 0) return; const t = window.setTimeout(() => setCooldown(c => c - 1), 1000); return () => clearTimeout(t); }, [cooldown]);
  useEffect(() => { if (step !== "done") return; const t = window.setTimeout(() => navigate({ to: "/parcours", replace: true }), 900); return () => clearTimeout(t); }, [step, navigate]);

  const sendCode = async () => {
    setError("");
    if (!z.string().trim().email().max(254).safeParse(email).success) { setError(fr ? "Saisissez une adresse e-mail valide." : "Enter a valid email address."); return; }
    setPending(true);
    try {
      await rememberGuest();
      const { error: e } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true, emailRedirectTo: `${window.location.origin}/auth` } });
      if (e) { setError(e.status === 429 ? (fr ? "Trop de demandes. Patientez quelques minutes." : "Too many requests. Please wait a few minutes.") : (fr ? "L'e-mail n'a pas pu être envoyé. Réessayez." : "The email could not be sent. Please try again.")); return; }
      setStep("code"); setCode(""); setCooldown(RESEND_SECONDS);
    } finally { setPending(false); }
  };

  const verifyCode = async () => {
    if (!/^\d{6,8}$/.test(code)) { setError(fr ? "Saisissez le code reçu par e-mail." : "Enter the code from your email."); return; }
    setError(""); setPending(true);
    try {
      const { error: e } = await supabase.auth.verifyOtp({ email: email.trim(), token: code, type: "email" });
      if (e) { setError(fr ? "Code incorrect ou expiré." : "Incorrect or expired code."); return; }
      await route();
    } finally { setPending(false); }
  };

  const google = async () => {
    setError(""); setPending(true);
    try {
      await rememberGuest();
      const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/auth` });
      if (result.error) { setError(fr ? "La connexion Google a échoué. Réessayez." : "Google sign-in failed. Please try again."); return; }
      if (result.redirected) return;
      await route();
    } finally { setPending(false); }
  };

  const saveDetails = async () => {
    setError(""); const parsed = detailsSchema.safeParse({ ...details, phone: normalizedPhone(details.phone, country) });
    if (!parsed.success) { const next: Record<string, string> = {}; for (const issue of parsed.error.issues) { const f = String(issue.path[0]); next[f] = f === "phone" ? (fr ? "Saisissez un numéro international valide." : "Enter a valid international number.") : f === "full_name" ? (fr ? "Le nom doit contenir 2 à 80 caractères." : "Name must contain 2–80 characters.") : (fr ? "Ce champ est obligatoire." : "This field is required."); } setErrors(next); return; }
    setErrors({}); setPending(true);
    try {
      const guestToken = sessionStorage.getItem(GUEST_KEY) ?? undefined;
      const result = await complete({ data: { details: parsed.data, guestToken } });
      if (!result.ok) { setError(result.error === "phone_taken" ? (fr ? "Ce numéro est déjà utilisé par un autre compte." : "This number is already used by another account.") : (fr ? "Impossible d'enregistrer. Réessayez." : "Could not save. Please try again.")); return; }
      sessionStorage.removeItem(GUEST_KEY); await qc.invalidateQueries();
      if (!result.transferred) { setError(fr ? "Compte créé. Le transfert de votre ancien parcours nécessite notre aide : bibleenmain00@gmail.com." : "Account created. Your previous journey needs help transferring: bibleenmain00@gmail.com."); return; }
      setStep("done");
    } catch { setError(fr ? "Impossible d'enregistrer. Réessayez." : "Could not save. Please try again."); } finally { setPending(false); }
  };

  const stepIndex = step === "done" ? 2 : step === "details" ? 1 : 0;
  return <div className="mx-auto min-h-screen w-full max-w-md px-5 py-7 sm:px-6 sm:py-10">
    <header className="flex items-center justify-between"><Link to="/" className="flex items-center gap-3"><img src={appIcon.url} alt="" className="size-12 rounded-lg" /><span className="font-serif text-2xl">Bible en Main</span></Link><Button variant="ghost" size="sm" onClick={() => setLang(fr ? "en" : "fr")}>{fr ? "EN" : "FR"}</Button></header>
    <ol className="my-8 flex items-center justify-between gap-2 text-xs text-clay" aria-label={fr ? "Étapes de connexion" : "Sign-in steps"}>{(fr ? ["Connexion", "Vos coordonnées", "Bienvenue"] : ["Sign in", "Your details", "Welcome"]).map((label, i) => <li key={label} className={`flex items-center gap-2 ${i === stepIndex ? "text-ribbon" : ""}`}><span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-current">{i + 1}</span><span>{label}</span></li>)}</ol>
    {step === "checking" ? <p role="status" className="py-14 text-center text-sm text-clay"><LoaderCircle className="mx-auto mb-3 animate-spin" />{fr ? "Chargement…" : "Loading…"}</p>
    : step === "done" ? <div className="py-14 text-center"><Check className="mx-auto size-12 text-ribbon" /><h1 className="mt-5 font-serif text-3xl">{fr ? "Bienvenue chez vous" : "Welcome home"}</h1><p className="mt-3 text-sm text-clay">{fr ? "Vous êtes connecté." : "You are signed in."}</p></div>
    : <>
      <h1 className="font-serif text-3xl leading-tight">{step === "code" ? (fr ? "Vérifiez votre boîte mail" : "Check your inbox") : step === "details" ? (fr ? "Encore une étape" : "One more step") : (fr ? "Votre parcours commence ici" : "Your journey starts here")}</h1>
      <p className="mt-3 mb-7 text-sm leading-relaxed text-clay">{step === "code" ? `${fr ? "Nous avons envoyé un e-mail à" : "We sent an email to"} ${email.trim()}. ${fr ? "Saisissez le code ou cliquez sur le lien qu'il contient." : "Enter the code or tap the link inside it."}` : step === "details" ? (fr ? "Complétez vos coordonnées pour créer votre compte." : "Complete your details to create your account.") : (fr ? "Connectez-vous sans mot de passe, par e-mail ou avec Google." : "Sign in without a password, by email or with Google.")}</p>
      {step === "signin" && <div className="space-y-5">
        <button type="button" onClick={() => void google()} disabled={pending} className="flex h-12 w-full items-center justify-center gap-[10px] rounded-md border px-3 text-sm font-medium disabled:opacity-60" style={{ background: "#FFFFFF", borderColor: "#747775", color: "#1F1F1F" }}><GoogleLogo />{fr ? "Continuer avec Google" : "Continue with Google"}</button>
        <div className="flex items-center gap-3 text-xs text-clay"><span className="h-px flex-1 bg-border" />{fr ? "ou" : "or"}<span className="h-px flex-1 bg-border" /></div>
        <form noValidate onSubmit={e => { e.preventDefault(); void sendCode(); }} className="space-y-4">
          <label htmlFor="auth-email" className="text-sm font-medium">{fr ? "Adresse e-mail" : "Email address"}</label>
          <Input id="auth-email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} className="h-11 bg-card" />
          <Button type="submit" disabled={pending} className="h-12 w-full">{pending ? <LoaderCircle className="animate-spin" /> : <Mail />}{fr ? "Recevoir mon code par e-mail" : "Email me a sign-in code"}</Button>
        </form>
      </div>}
      {step === "code" && <form onSubmit={e => { e.preventDefault(); void verifyCode(); }} className="space-y-5">
        <label htmlFor="email-code" className="text-sm font-medium">{fr ? "Code de vérification" : "Verification code"}</label>
        <Input id="email-code" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))} maxLength={8} className="h-14 text-center text-2xl" />
        <Button type="submit" className="h-12 w-full" disabled={pending}>{pending ? <LoaderCircle className="animate-spin" /> : <ShieldCheck />}{fr ? "Vérifier et continuer" : "Verify and continue"}</Button>
        <Button type="button" variant="outline" className="w-full" disabled={pending || cooldown > 0} onClick={() => void sendCode()}>{cooldown > 0 ? `${fr ? "Renvoyer dans" : "Resend in"} ${cooldown}s` : fr ? "Renvoyer l'e-mail" : "Resend email"}</Button>
        <Button type="button" variant="ghost" className="w-full" onClick={() => { setStep("signin"); setError(""); }}><ArrowLeft />{fr ? "Changer d'adresse" : "Use another address"}</Button>
      </form>}
      {step === "details" && <form noValidate onSubmit={e => { e.preventDefault(); void saveDetails(); }} className="space-y-6">
        <PhoneAccountForm value={details} onChange={setDetails} errors={errors} countryCode={country} setCountryCode={setCountry} />
        <div className="space-y-4 border-t border-border pt-5">
          <label className="flex items-start gap-3 text-xs leading-relaxed"><input type="checkbox" checked={details.privacy} onChange={e => setDetails({ ...details, privacy: e.target.checked })} className="mt-0.5 size-4 shrink-0 accent-primary" required /><span>{fr ? "J'ai lu la " : "I have read the "}<Link to={fr ? "/confidentialite" : "/privacy"} target="_blank" rel="noopener noreferrer" className="text-ribbon underline">{fr ? "Politique de confidentialité" : "Privacy Policy"}</Link>{fr ? " et j'accepte que mon nom, mon adresse et mon numéro de téléphone soient collectés pour créer mon compte." : " and agree that my name, address and phone number are collected to create my account."}</span></label>
          {errors['privacy'] && <p className="text-xs text-destructive">{fr ? "Ce consentement est requis." : "This consent is required."}</p>}
          <label className="flex items-start gap-3 text-xs leading-relaxed"><input type="checkbox" checked={details.sensitive} onChange={e => setDetails({ ...details, sensitive: e.target.checked })} className="mt-0.5 size-4 shrink-0 accent-primary" required /><span>{fr ? "J'accepte explicitement que mes réponses aux leçons, qui peuvent révéler mes convictions religieuses, soient enregistrées et partagées avec mon mentor si j'en choisis un." : "I explicitly agree that my lesson responses, which may reveal my religious beliefs, are saved and shared with my mentor if I choose one."}</span></label>
          {errors['sensitive'] && <p className="text-xs text-destructive">{fr ? "Ce consentement est requis." : "This consent is required."}</p>}
        </div>
        <Button type="submit" disabled={pending} className="h-12 w-full">{pending ? <LoaderCircle className="animate-spin" /> : <ArrowRight />}{fr ? "Créer mon compte" : "Create my account"}</Button>
      </form>}
      {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
      <p className="mt-6 flex items-center justify-center gap-2 text-xs text-clay"><ShieldCheck className="size-4" />{fr ? "Votre vie privée compte." : "Your privacy matters."}</p>
    </>}
  </div>;
}
