# Bible Path

Base44 Build Prompt — "Bible en Main" Study App

Copy everything below into Base44's app-builder prompt box.

Build a mobile-friendly web app called "Bible en Main" — a guided Bible study companion based on a 24-lesson (plus summary) Seventh-day Adventist evangelistic course, designed to walk a user from their first lesson through to a decision for baptism.

Purpose

Help a user (a "seeker") work through the Bible en Main course at their own pace, either alone or paired with a mentor/Bible worker, tracking progress and comprehension along the way, and culminating in a baptism-readiness milestone.

Core content — the 24 lessons (+ summary)

Structure the app's content around these lessons, in this order:

Le message de la Bible (The Message of the Bible)

Le monde et son destin (The World and Its Destiny)

Vers un monde nouveau (Toward a New World)

Le retour du Christ (The Return of Christ)

Les signes des temps (The Signs of the Times)

Dieu existe (God Exists)

Satan

Jésus-Christ

Le péché (Sin)

La conversion (Conversion)

La nouvelle naissance (The New Birth)

La Loi de Dieu (The Law of God)

Le septième jour (The Seventh Day)

Le dimanche (Sunday)

La prière (Prayer)

La mort (Death)

L'enfer (Hell)

Le millénium (The Millennium)

Le jugement (The Judgment)

La véritable Église (The True Church)

Le baptême (Baptism)

La libéralité (Stewardship/Generosity)

La santé (Health)

Sur les traces de Jésus (Following in Jesus' Footsteps)

Résumé des leçons 23 et 24 (Summary of Lessons 23–24)

Each lesson should have: a title, a short introduction, a set of Bible-verse-based questions with reference fields (book/chapter/verse), a space to write the answer found in Scripture, and a short takeaway/application note.

Key features to build

1. Lesson library & viewer

List all 24(+1) lessons with progress indicators (not started / in progress / completed).

Lesson detail view showing the questions, Bible references, and an input field for the user's own answer to each question.

Allow marking a lesson complete only after all questions are answered.

2. Progress tracker

Visual progress bar / journey map showing how far along the 25 lessons the user is.

Store completion dates for each lesson.

Show a "baptism readiness" milestone that unlocks after lessons 1–22 are complete (core doctrine + baptism lesson), with lessons 23–25 as follow-up/consolidation.

3. Mentor / Bible worker mode

Optional role: "Mentor" can be linked to one or more "Seeker" accounts.

Mentors can see a seeker's progress, review answers, leave comments/encouragement on each lesson, and schedule the next study session (date/time field, optional notes).

Seekers can message or leave questions for their mentor per lesson.

4. Notes & journal

A personal journal per user for reflections, prayer requests, and questions that come up during study.

Notes should be attachable to a specific lesson or freestanding.

5. Verse lookup helper

When a lesson references a verse (e.g., "Daniel 2:44"), show the reference as a tappable chip that opens the verse text (use a public open Bible API/text, KJV as default, allow switching translations if available).

6. Reminders

Optional weekly reminder/notification to continue the next lesson.

Optional reminder for scheduled mentor sessions.

7. Baptism decision flow

After lesson 21 ("Le baptême") is completed, show a gentle, non-pressuring "next steps" screen: a short reflection prompt, an option to request a conversation with a mentor/pastor, and a "I'd like to talk about baptism" button that notifies the linked mentor.

This should never auto-declare anyone "ready" — it should always route to a human conversation with a mentor or pastor.

8. Admin/content management

Simple admin view to edit lesson text, questions, and verse references without touching code, so church leaders can adapt content or add localized versions later (e.g., English alongside French).

Data model (suggested)

Users (role: seeker / mentor / admin)

Lessons (id, order, title_fr, title_en, intro, questions[], verses[])

Answers (user_id, lesson_id, question_id, answer_text, timestamp)

Progress (user_id, lesson_id, status, completed_at)

MentorLinks (mentor_id, seeker_id)

Notes (user_id, lesson_id (nullable), text, timestamp)

Sessions (mentor_id, seeker_id, datetime, notes)

Tone & design

Warm, welcoming, non-judgmental tone throughout — this is a spiritual journey, not a quiz to pass.

Simple, calm visual design: soft neutral palette, clear typography, generous spacing, mobile-first.

Available in French (primary) and English (secondary), with a language toggle.

Non-goals

Do not have the app itself make theological pronouncements beyond the provided lesson content.

Do not auto-certify or "grade" someone as ready for baptism — that decision always routes to a human mentor/pastor conversation, as described above.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://journey-to-faith-guide.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d0ab69ae-c310-4edb-a952-1d4573233932).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
