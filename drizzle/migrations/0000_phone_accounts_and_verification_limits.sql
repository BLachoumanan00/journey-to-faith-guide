CREATE TABLE public.users (
 id uuid PRIMARY KEY,
 full_name text NOT NULL,
 phone_hash text NOT NULL UNIQUE,
 phone_encrypted text NOT NULL,
 address_encrypted text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 last_login timestamptz NOT NULL DEFAULT now(),
 consent_privacy_at timestamptz NOT NULL DEFAULT now(),
 consent_sensitive_at timestamptz,
 policy_version text NOT NULL DEFAULT '2026-10-19'
);
GRANT SELECT ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own encrypted account" ON public.users FOR SELECT TO authenticated USING (id = auth.uid());

CREATE TABLE public.phone_auth_limits (key_hash text PRIMARY KEY, window_start timestamptz NOT NULL DEFAULT now(), requests integer NOT NULL DEFAULT 0, last_request timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.phone_auth_limits TO service_role;
ALTER TABLE public.phone_auth_limits ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.phone_auth_challenges (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), secret_hash text NOT NULL,
 phone_hash text NOT NULL, phone_encrypted text NOT NULL, details_encrypted text NOT NULL,
 guest_id uuid, otp_type text NOT NULL DEFAULT 'sms',
 attempts integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(),
 expires_at timestamptz NOT NULL DEFAULT (now() + interval '5 minutes'), consumed_at timestamptz
);
GRANT ALL ON public.phone_auth_challenges TO service_role;
ALTER TABLE public.phone_auth_challenges ENABLE ROW LEVEL SECURITY;

CREATE FUNCTION public.claim_phone_request(_phone_hash text, _ip_hash text) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE p public.phone_auth_limits; i public.phone_auth_limits;
BEGIN
 PERFORM pg_advisory_xact_lock(hashtextextended('phone-auth-global', 0));
 INSERT INTO public.phone_auth_limits(key_hash, requests, last_request) VALUES (_phone_hash, 0, now() - interval '1 minute'), (_ip_hash, 0, now() - interval '1 minute') ON CONFLICT DO NOTHING;
 SELECT * INTO p FROM public.phone_auth_limits WHERE key_hash = _phone_hash;
 SELECT * INTO i FROM public.phone_auth_limits WHERE key_hash = _ip_hash;
 IF p.last_request > now() - interval '60 seconds' THEN RETURN false; END IF;
 IF p.window_start > now() - interval '1 hour' AND p.requests >= 5 THEN RETURN false; END IF;
 IF i.window_start > now() - interval '1 hour' AND i.requests >= 20 THEN RETURN false; END IF;
 UPDATE public.phone_auth_limits SET requests = CASE WHEN window_start <= now() - interval '1 hour' THEN 1 ELSE requests + 1 END, window_start = CASE WHEN window_start <= now() - interval '1 hour' THEN now() ELSE window_start END, last_request = now() WHERE key_hash IN (_phone_hash, _ip_hash);
 RETURN true;
END; $$;
REVOKE ALL ON FUNCTION public.claim_phone_request(text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_phone_request(text,text) TO service_role;

CREATE FUNCTION public.claim_phone_attempt(_id uuid, _secret_hash text) RETURNS SETOF public.phone_auth_challenges
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 RETURN QUERY UPDATE public.phone_auth_challenges SET attempts = attempts + 1
 WHERE id = _id AND secret_hash = _secret_hash AND consumed_at IS NULL AND expires_at > now() AND attempts < 5 RETURNING *;
END; $$;
REVOKE ALL ON FUNCTION public.claim_phone_attempt(uuid,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_phone_attempt(uuid,text) TO service_role;

CREATE FUNCTION public.finish_phone_challenge(_id uuid, _secret_hash text) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE changed integer;
BEGIN
 UPDATE public.phone_auth_challenges SET consumed_at = now() WHERE id = _id AND secret_hash = _secret_hash AND consumed_at IS NULL AND expires_at > now();
 GET DIAGNOSTICS changed = ROW_COUNT;
 RETURN changed = 1;
END; $$;
REVOKE ALL ON FUNCTION public.finish_phone_challenge(uuid,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.finish_phone_challenge(uuid,text) TO service_role;

CREATE FUNCTION public.has_sensitive_consent() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$ SELECT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND consent_sensitive_at IS NOT NULL) $$;
REVOKE ALL ON FUNCTION public.has_sensitive_consent() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_sensitive_consent() TO authenticated;
CREATE POLICY "Sensitive consent required for answers" ON public.answers AS RESTRICTIVE FOR ALL TO authenticated USING (public.has_sensitive_consent()) WITH CHECK (public.has_sensitive_consent());
CREATE POLICY "Sensitive consent required for notes" ON public.notes AS RESTRICTIVE FOR ALL TO authenticated USING (public.has_sensitive_consent()) WITH CHECK (public.has_sensitive_consent());
CREATE POLICY "Sensitive consent required for messages" ON public.lesson_messages AS RESTRICTIVE FOR ALL TO authenticated USING (public.has_sensitive_consent()) WITH CHECK (public.has_sensitive_consent());

CREATE FUNCTION public.transfer_guest_study(_guest uuid, _user uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 IF _guest = _user THEN RETURN; END IF;
 UPDATE public.answers a SET user_id = _user WHERE user_id = _guest AND NOT EXISTS (SELECT 1 FROM public.answers b WHERE b.user_id = _user AND b.question_id = a.question_id);
 UPDATE public.progress a SET user_id = _user WHERE user_id = _guest AND NOT EXISTS (SELECT 1 FROM public.progress b WHERE b.user_id = _user AND b.lesson_id = a.lesson_id);
 UPDATE public.notes SET user_id = _user WHERE user_id = _guest;
 UPDATE public.baptism_requests SET seeker_id = _user WHERE seeker_id = _guest;
 UPDATE public.lesson_messages SET author_id = _user WHERE author_id = _guest;
 UPDATE public.lesson_messages SET seeker_id = _user WHERE seeker_id = _guest;
 UPDATE public.study_sessions SET seeker_id = _user WHERE seeker_id = _guest AND NOT EXISTS (SELECT 1 FROM public.study_sessions b WHERE b.seeker_id = _user AND b.mentor_id = public.study_sessions.mentor_id AND b.scheduled_at = public.study_sessions.scheduled_at);
 UPDATE public.mentor_links a SET seeker_id = _user WHERE seeker_id = _guest AND mentor_id <> _user AND NOT EXISTS (SELECT 1 FROM public.mentor_links b WHERE b.seeker_id = _user AND b.mentor_id = a.mentor_id);
END; $$;
REVOKE ALL ON FUNCTION public.transfer_guest_study(uuid,uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.transfer_guest_study(uuid,uuid) TO service_role;