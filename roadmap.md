# Passwordless phone accounts

- [x] SMS details and verification screens, session-driven navigation, legacy guest-transfer implementation.
- [x] Encrypted users storage, separate privacy/sensitive consents, account edit/export/delete and authorized admin CSV screens.
- [x] French and English privacy pages with truthful hosting/provider disclosures.
- [x] Persistent phone/IP limits, five-minute verification window, five attempts, resend cooldown and fail-closed CAPTCHA integration.
- [x] Validate 13 rules/encryption/export tests and bilingual phone-friendly public form; verify separate privacy windows and unavailable-SMS state.
- [ ] Configure and verify SMS delivery, CAPTCHA keys and provider-side direct-API protection; only then enable PHONE_AUTH_SETUP_VERIFIED. Blocked by missing provider configuration and previously declined CAPTCHA secrets.
- [ ] Exercise real verified-phone account creation, guest transfer, account edit/export/delete and admin authorization end-to-end. Blocked by unavailable SMS verification and no verified test account.
- [ ] Confirm provider processing locations and backup/log retention for final privacy disclosures. Blocked by provider details.