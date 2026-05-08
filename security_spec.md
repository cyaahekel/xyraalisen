# XyraaLicense Security Specification

## Data Invariants
- A License must belong to a valid User.
- A User cannot change their own 'role' to ADMIN.
- Transactions are immutable once created (except for status handled by Admin).
- HWID can only be reset by Monthly/Permanent tier owners or Admins.

## The Dirty Dozen Payloads (Rejection Targets)
1. **Self-Escalation**: User attempting to set `role: 'ADMIN'` during registration.
2. **Key Spoofing**: User trying to create a license with a custom `key` string.
3. **Ghost License**: Creating a license for a non-existent `userId`.
4. **ID Poisoning**: Using a 1MB string as a tool ID.
5. **Unauthorized Read**: User A trying to read User B's license details.
6. **Shadow Field Injection**: Adding `isAdmin: true` to a tool document.
7. **Terminal Shortcut**: Changing a Transaction status from `PENDING` to `PAID` without admin authority.
8. **HWID Hijack**: User A changing User B's HWID.
9. **Timestamp Forgery**: Providing a client-side `createdAt` in the past.
10. **Bulk Scrape**: Querying all licenses without a `where` clause for `userId`.
11. **Tool Vandalism**: Regular user attempting to delete a tool from the vault.
12. **PII Leak**: Accessing another user's email via a blanket read.

## Test Runner Logic
The `firestore.rules` will be validated to ensure all the above payloads return `PERMISSION_DENIED` for unauthorized users.
