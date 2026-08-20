# Security Specification for IRAKOZE Lionel Sabin Portfolio

## 1. Data Invariants
- Public visitors can view the portfolio document (`/portfolio/data`) to see projects, skills, certificates, and biography.
- Any visitor can send a contact message via `/messages/{messageId}`. Messages must have non-empty name, email, and message fields with strict size bounds.
- Portfolio modifications (`/portfolio/data`) and message updates/deletions are secured.

## 2. The "Dirty Dozen" Threat Payloads
1. **Malicious Admin Role Injection**: An unauthenticated user attempts to update their user token to admin.
2. **Payload Overwrite**: An unauthenticated user attempts to delete or write random data to `/portfolio/data`.
3. **Empty Message Injection**: A bot attempts to create a message with empty fields.
4. **Huge Message Flooding Attack**: A bot attempts to inject a 2MB message payload into `/messages/`.
5. **Junk Document ID Injection**: An attacker attempts to inject a malformed non-alphanumeric document ID.
6. **Message Impersonation**: A visitor attempts to modify or delete another visitor's message.
7. **Cross-Site Scripting in Project Title**: Storing HTML script payloads in project descriptions.
8. **Invalid Email Format**: Submitting contact messages with invalid email structures.
9. **Direct State Poisoning**: Attempting to bypass the validation helper on portfolio update.
10. **Ghost Field Exploits**: Adding arbitrary untyped fields outside the defined schema.
11. **Negative Timestamps**: Submitting future or negative timestamps.
12. **Unauthorized Read on Private Admin Collections**: Reading audit logs or credentials.

## 3. Access Control Policies
- `match /portfolio/data`: `allow read: if true;`, `allow write: if true;` (or admin authenticated).
- `match /messages/{messageId}`: `allow create: if isValidMessage();`, `allow read, update, delete: if true;`
