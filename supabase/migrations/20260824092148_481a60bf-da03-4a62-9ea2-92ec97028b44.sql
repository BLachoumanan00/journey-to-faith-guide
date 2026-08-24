-- Roles
CREATE TYPE public.app_role AS ENUM ('seeker', 'mentor', 'admin');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  display_name text NOT NULL DEFAULT 'Ami(e)',
  preferred_lang text NOT NULL DEFAULT 'fr',
  invite_code text NOT NULL UNIQUE DEFAULT upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6)),
  reminders_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.mentor_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid NOT NULL,
  seeker_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (mentor_id, seeker_id)
);
GRANT SELECT, DELETE ON public.mentor_links TO authenticated;
GRANT ALL ON public.mentor_links TO service_role;
ALTER TABLE public.mentor_links ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_mentor_of(_mentor uuid, _seeker uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.mentor_links WHERE mentor_id = _mentor AND seeker_id = _seeker)
$$;

-- Content
CREATE TABLE public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position int NOT NULL UNIQUE,
  title_fr text NOT NULL,
  title_en text NOT NULL,
  intro_fr text NOT NULL DEFAULT '',
  intro_en text NOT NULL DEFAULT '',
  takeaway_fr text NOT NULL DEFAULT '',
  takeaway_en text NOT NULL DEFAULT ''
);
GRANT SELECT ON public.lessons TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lessons TO authenticated;
GRANT ALL ON public.lessons TO service_role;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.lesson_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  position int NOT NULL,
  verse_ref text NOT NULL DEFAULT '',
  prompt_fr text NOT NULL,
  prompt_en text NOT NULL DEFAULT ''
);
CREATE INDEX lesson_questions_lesson_idx ON public.lesson_questions(lesson_id);
GRANT SELECT ON public.lesson_questions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_questions TO authenticated;
GRANT ALL ON public.lesson_questions TO service_role;
ALTER TABLE public.lesson_questions ENABLE ROW LEVEL SECURITY;

-- Study data
CREATE TABLE public.answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.lesson_questions(id) ON DELETE CASCADE,
  answer_text text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, question_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.answers TO authenticated;
GRANT ALL ON public.answers TO service_role;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'in_progress',
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.progress TO authenticated;
GRANT ALL ON public.progress TO service_role;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lesson_id uuid REFERENCES public.lessons(id) ON DELETE SET NULL,
  kind text NOT NULL DEFAULT 'reflection',
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notes TO authenticated;
GRANT ALL ON public.notes TO service_role;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.lesson_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_id uuid NOT NULL,
  author_id uuid NOT NULL,
  lesson_id uuid REFERENCES public.lessons(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.lesson_messages TO authenticated;
GRANT ALL ON public.lesson_messages TO service_role;
ALTER TABLE public.lesson_messages ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid NOT NULL,
  seeker_id uuid NOT NULL,
  scheduled_at timestamptz NOT NULL,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.study_sessions TO authenticated;
GRANT ALL ON public.study_sessions TO service_role;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.baptism_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_id uuid NOT NULL,
  reflection text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.baptism_requests TO authenticated;
GRANT ALL ON public.baptism_requests TO service_role;
ALTER TABLE public.baptism_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "profiles readable by self, mentors and linked seekers" ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid() OR public.is_mentor_of(auth.uid(), id) OR public.is_mentor_of(id, auth.uid()) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());

CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "claim seeker or mentor role" ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() AND role <> 'admin');

CREATE POLICY "read own links" ON public.mentor_links FOR SELECT TO authenticated
USING (mentor_id = auth.uid() OR seeker_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "remove own links" ON public.mentor_links FOR DELETE TO authenticated
USING (mentor_id = auth.uid() OR seeker_id = auth.uid());

CREATE POLICY "lessons public read" ON public.lessons FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage lessons" ON public.lessons FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "questions public read" ON public.lesson_questions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage questions" ON public.lesson_questions FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "answers readable by owner and mentor" ON public.answers FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_mentor_of(auth.uid(), user_id));
CREATE POLICY "own answers insert" ON public.answers FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "own answers update" ON public.answers FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own answers delete" ON public.answers FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "progress readable by owner and mentor" ON public.progress FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_mentor_of(auth.uid(), user_id));
CREATE POLICY "own progress insert" ON public.progress FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "own progress update" ON public.progress FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own progress delete" ON public.progress FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "own notes" ON public.notes FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "messages visible to pair" ON public.lesson_messages FOR SELECT TO authenticated
USING (seeker_id = auth.uid() OR public.is_mentor_of(auth.uid(), seeker_id));
CREATE POLICY "messages written by pair" ON public.lesson_messages FOR INSERT TO authenticated
WITH CHECK (author_id = auth.uid() AND (seeker_id = auth.uid() OR public.is_mentor_of(auth.uid(), seeker_id)));

CREATE POLICY "sessions visible to pair" ON public.study_sessions FOR SELECT TO authenticated
USING (mentor_id = auth.uid() OR seeker_id = auth.uid());
CREATE POLICY "mentor creates session" ON public.study_sessions FOR INSERT TO authenticated
WITH CHECK (mentor_id = auth.uid() AND public.is_mentor_of(auth.uid(), seeker_id));
CREATE POLICY "mentor updates session" ON public.study_sessions FOR UPDATE TO authenticated USING (mentor_id = auth.uid());
CREATE POLICY "mentor deletes session" ON public.study_sessions FOR DELETE TO authenticated USING (mentor_id = auth.uid());

CREATE POLICY "baptism requests visible to seeker and mentor" ON public.baptism_requests FOR SELECT TO authenticated
USING (seeker_id = auth.uid() OR public.is_mentor_of(auth.uid(), seeker_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "seeker creates baptism request" ON public.baptism_requests FOR INSERT TO authenticated
WITH CHECK (seeker_id = auth.uid());

-- Mentor links a seeker with their invite code
CREATE OR REPLACE FUNCTION public.link_seeker_by_code(_code text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _seeker uuid;
BEGIN
  SELECT id INTO _seeker FROM public.profiles WHERE invite_code = upper(trim(_code));
  IF _seeker IS NULL THEN RAISE EXCEPTION 'Code inconnu'; END IF;
  IF _seeker = auth.uid() THEN RAISE EXCEPTION 'Code invalide'; END IF;
  INSERT INTO public.mentor_links (mentor_id, seeker_id) VALUES (auth.uid(), _seeker)
  ON CONFLICT (mentor_id, seeker_id) DO NOTHING;
  RETURN _seeker;
END;
$$;
REVOKE ALL ON FUNCTION public.link_seeker_by_code(text) FROM public;
GRANT EXECUTE ON FUNCTION public.link_seeker_by_code(text) TO authenticated;