## 2024-03-31 - [CRITICAL] Fix Insecure Direct Object Reference (IDOR) in Firestore Rules
**Vulnerability:** The `/messages/{messageId}` collection rule in `firestore.rules` permitted any authenticated user (`allow read: if isAuth();`) to read all chat messages across the entire application, leading to a severe data exposure.
**Learning:** Firestore rules lacking proper resource-level checks easily result in Broken Access Control. `isAuth()` alone is rarely sufficient for user-specific data; we must explicitly authorize the user against specific document fields (like `senderId` or `customerId`).
**Prevention:** Always scope read access strictly to the document owners using specific document data conditions: `resource.data.<userIdField> == request.auth.uid`. Implement test cases that verify access denial for unrelated, authenticated users.

## 2025-02-21 - Authorization Bypass in Firestore Rules
**Vulnerability:** Missing authorization check on document creation for bookings, tokens, reviews, and messages. Any authenticated user could create these documents on behalf of another user by providing an arbitrary `customerId` or `senderId` in the request payload.
**Learning:** Checking `isAuth()` is not sufficient to prevent spoofing if the document relies on an embedded user ID to determine ownership or relationships. We must ensure the ID provided in the payload matches the identity of the user making the request.
**Prevention:** Always include `request.resource.data.<ownerId> == request.auth.uid` in `create` rules for documents that include a reference to the user creating them.
