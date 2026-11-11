# Passwordless phone accounts

## Bible, Android publishing and own-domain email
- [ ] Verify real French verse loading and add retry for temporary failures.
- [ ] Add accessible Android Studio instructions and publish the changes.
- [ ] Grant and verify admin access for the verified bibleenmain00@gmail.com account.
- [ ] Set up own-domain authentication emails and send a real sign-in email. Blocked: sender domain setup must be completed by the owner.

## Admin announcement directory
- [x] Add role-protected contact directory, search and CSV/copy actions.
- [x] Add optional announcement consent and exclude non-consenting users from broadcast lists.
- [x] Pass 15 tests and confirm the available preview session cannot access private pages.
- [ ] Grant admin access to bibleenmain00@gmail.com. Blocked: no verified account exists for that address; user must sign in and complete their account first.
- [ ] Verify directory, downloads, clipboard and saved announcement preference end-to-end. Blocked: available preview session redirects to sign-in and no authorized admin account exists.

- [x] SMS details and verification screens, session-driven navigation, legacy guest-transfer implementation.
- [x] Encrypted users storage, separate privacy/sensitive consents, account edit/export/delete and authorized admin CSV screens.
- [x] French and English privacy pages with truthful hosting/provider disclosures.
- [x] Persistent phone/IP limits, five-minute verification window, five attempts, resend cooldown and fail-closed CAPTCHA integration.
- [x] Validate 13 rules/encryption/export tests and bilingual phone-friendly public form; verify separate privacy windows and unavailable-SMS state.
- [x] Replace SMS sign-in with passwordless email and Google, as requested; SMS setup is no longer required.
- [ ] Exercise verified email/Google account creation, guest transfer and account edit/export/delete end-to-end. Blocked by unavailable completed signed-in test session.
- [ ] Confirm provider processing locations and backup/log retention for final privacy disclosures. Blocked by provider details.