CREATE OR REPLACE FUNCTION public.transfer_guest_study(_guest uuid, _user uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 IF _guest = _user THEN RETURN; END IF;
 IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = _user AND consent_sensitive_at IS NOT NULL) THEN RAISE EXCEPTION 'Verified account consent required'; END IF;
 UPDATE public.answers destination SET answer_text = source.answer_text, choice_index = source.choice_index, updated_at = source.updated_at FROM public.answers source WHERE source.user_id = _guest AND destination.user_id = _user AND source.question_id = destination.question_id AND source.updated_at > destination.updated_at;
 DELETE FROM public.answers source WHERE source.user_id = _guest AND EXISTS (SELECT 1 FROM public.answers destination WHERE destination.user_id = _user AND destination.question_id = source.question_id);
 UPDATE public.answers SET user_id = _user WHERE user_id = _guest;
 UPDATE public.progress destination SET status = CASE WHEN destination.status = 'completed' OR source.status = 'completed' THEN 'completed' WHEN source.updated_at > destination.updated_at THEN source.status ELSE destination.status END, completed_at = COALESCE(destination.completed_at, source.completed_at), updated_at = GREATEST(destination.updated_at, source.updated_at) FROM public.progress source WHERE source.user_id = _guest AND destination.user_id = _user AND source.lesson_id = destination.lesson_id;
 DELETE FROM public.progress source WHERE source.user_id = _guest AND EXISTS (SELECT 1 FROM public.progress destination WHERE destination.user_id = _user AND destination.lesson_id = source.lesson_id);
 UPDATE public.progress SET user_id = _user WHERE user_id = _guest;
 UPDATE public.notes SET user_id = _user WHERE user_id = _guest;
 UPDATE public.baptism_requests SET seeker_id = _user WHERE seeker_id = _guest;
 UPDATE public.lesson_messages SET author_id = _user WHERE author_id = _guest;
 UPDATE public.lesson_messages SET seeker_id = _user WHERE seeker_id = _guest;
 DELETE FROM public.study_sessions source WHERE source.seeker_id = _guest AND EXISTS (SELECT 1 FROM public.study_sessions destination WHERE destination.seeker_id = _user AND destination.mentor_id = source.mentor_id AND destination.scheduled_at = source.scheduled_at);
 UPDATE public.study_sessions SET seeker_id = _user WHERE seeker_id = _guest;
 DELETE FROM public.mentor_links source WHERE source.seeker_id = _guest AND (source.mentor_id = _user OR EXISTS (SELECT 1 FROM public.mentor_links destination WHERE destination.seeker_id = _user AND destination.mentor_id = source.mentor_id));
 UPDATE public.mentor_links SET seeker_id = _user WHERE seeker_id = _guest;
END; $$;
REVOKE ALL ON FUNCTION public.transfer_guest_study(uuid,uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.transfer_guest_study(uuid,uuid) TO service_role;
CREATE POLICY "Sensitive consent required for baptism requests" ON public.baptism_requests AS RESTRICTIVE FOR ALL TO authenticated USING (public.has_sensitive_consent()) WITH CHECK (public.has_sensitive_consent());
CREATE POLICY "Sensitive consent required for mentor links" ON public.mentor_links AS RESTRICTIVE FOR ALL TO authenticated USING (public.has_sensitive_consent()) WITH CHECK (public.has_sensitive_consent());
CREATE POLICY "Sensitive consent required for study sessions" ON public.study_sessions AS RESTRICTIVE FOR ALL TO authenticated USING (public.has_sensitive_consent()) WITH CHECK (public.has_sensitive_consent());