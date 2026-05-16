# Security Specification

## 1. Data Invariants
- A `User` must have a `uid`, `username`, `displayName`, `historyPrivacy`, `onboardingCompleted` (bool), `createdAt`, `updatedAt` (both numbers).
- `User` documents path is `users/{userId}` where `userId` matches `request.auth.uid` for creates/updates. Follows can only be created with the followerId matching `request.auth.uid`.
- Reviews have an `authorId`, `showName`, `rating`, `content`, `createdAt`. Reviews can only be created if `authorId` matches `request.auth.uid` or if `rating` is a valid number. Reviews are read-only based on the privacy settings of the author. But Firebase Rules can't query another document easily for every read in `list` operation unless we use `resource.data` to limit it. Oh! Actually, the profile read logic in `AppProfile.tsx` for reviews is:
`query(collection(db, 'reviews'), where('authorId', '==', targetUserId))`
For `Review`, we need to secure this.

- `Follow` path is `follows/{followId}` where `followId` is `{followerId}_{followingId}`.

## 2. Dirty Dozen Payloads (Mocked)
1. Identity spoofing User create: `ownerId` set to another user.
2. Identity spoofing Review create.
3. Updating someone else's User profile.
4. Ghost Field injection in User.
...
