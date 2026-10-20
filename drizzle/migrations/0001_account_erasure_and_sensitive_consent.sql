CREATE FUNCTION public.withdraw_account_consent(_user uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 UPDATE public.users SET consent_sensitive_at = NULL WHERE id = _user;
 DELETE FROM public.answers WHERE user_id = _user;
 DELETE FROM public.notes WHERE user_id = _user;
 DELETE FROM public.lesson_messages WHERE seeker_id = _user OR author_id = _user;
 DELETE FROM public.baptism_requests WHERE seeker_id = _user;
 DELETE FROM public.mentor_links WHERE seeker_id = _user OR mentor_id = _user;
 DELETE FROM public.study_sessions WHERE seeker_id = _user OR mentor_id = _user;
END; $$;
REVOKE ALL ON FUNCTION public.withdraw_account_consent(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.withdraw_account_consent(uuid) TO service_role;

CREATE FUNCTION public.erase_account_data(_user uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE hash text;
BEGIN
 SELECT phone_hash INTO hash FROM public.users WHERE id = _user;
 PERFORM public.withdraw_account_consent(_user);
 DELETE FROM public.progress WHERE user_id = _user;
 DELETE FROM public.phone_auth_challenges WHERE guest_id = _user OR phone_hash = hash;
 DELETE FROM public.users WHERE id = _user;
 DELETE FROM public.profiles WHERE id = _user;
 DELETE FROM public.user_roles WHERE user_id = _user;
END; $$;
REVOKE ALL ON FUNCTION public.erase_account_data(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.erase_account_data(uuid) TO service_role;

CREATE FUNCTION public.purge_expired_phone_challenges() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 DELETE FROM public.phone_auth_challenges WHERE expires_at < now() OR consumed_at IS NOT NULL;
 DELETE FROM public.phone_auth_limits WHERE window_start < now() - interval '1 day';
 RETURN NEW;
END; $$;
CREATE TRIGGER purge_expired_phone_challenges_before_insert BEFORE INSERT ON public.phone_auth_challenges FOR EACH STATEMENT EXECUTE FUNCTION public.purge_expired_phone_challenges();