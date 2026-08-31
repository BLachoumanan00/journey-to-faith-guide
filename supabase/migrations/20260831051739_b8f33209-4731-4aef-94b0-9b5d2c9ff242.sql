ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS explanation_fr text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS explanation_en text NOT NULL DEFAULT '';