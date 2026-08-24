REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.is_mentor_of(uuid, uuid) FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.link_seeker_by_code(text) FROM anon;
GRANT EXECUTE ON FUNCTION public.link_seeker_by_code(text) TO authenticated;