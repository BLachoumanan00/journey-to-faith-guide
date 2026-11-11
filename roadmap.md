# Passwordless phone accounts

## Bible, Android publishing and own-domain email
- [x] Verify real French verse loading and add retry for temporary failures.
- [x] Add accessible Android Studio instructions; request publishing after passing tests and scan.
- [x] Grant and verify admin access for the verified bibleenmain00@gmail.com account; directory and CSV download confirmed in that account.
- [ ] Set up own-domain authentication emails and send a real sign-in email. Blocked: sender domain setup must be completed by the owner.

## Admin announcement directory
- [x] Add role-protected contact directory, search and CSV/copy actions.
- [x] Add optional announcement consent and exclude non-consenting users from broadcast lists.
- [x] Pass 15 tests and confirm the available preview session cannot access private pages.
- [x] Grant admin access to bibleenmain00@gmail.com and verify the directory and accounts CSV download.
- [ ] Verify announcement clipboard and saved preference end-to-end. Deferred: not part of the current request; requires changing a real user's announcement preference.

- [x] SMS details and verification screens, session-driven navigation, legacy guest-transfer implementation.
- [x] Encrypted users storage, separate privacy/sensitive consents, account edit/export/delete and authorized admin CSV screens.
- [x] French and English privacy pages with truthful hosting/provider disclosures.
- [x] Persistent phone/IP limits, five-minute verification window, five attempts, resend cooldown and fail-closed CAPTCHA integration.
- [x] Validate 13 rules/encryption/export tests and bilingual phone-friendly public form; verify separate privacy windows and unavailable-SMS state.
- [x] Replace SMS sign-in with passwordless email and Google, as requested; SMS setup is no longer required.
- [ ] Exercise new email/Google account creation and guest transfer. Blocked: real sign-in delivery requires sender-domain setup and a new account.
- [ ] Exercise destructive account edit/delete flows. Blocked: requires a disposable verified account; current session is the owner's real account.
- [ ] Confirm provider processing locations and backup/log retention for final privacy disclosures. Blocked by provider details.