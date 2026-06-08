## Services Architecture

Services are responsible for business logic, persistence, and external integrations.

UI components must not directly access:

* localStorage (except for UI preferences/theme);
* IndexedDB (only used as optional cache);
* Supabase API;
* OpenAI API;
* mock data files;
* browser storage internals.

Components should call Zustand actions.
Zustand actions may call services.

Recommended flow:

```txt
UI Component
  → Zustand Store / Server Action
    → Service
      → Supabase Client / API Route / Cache
```

## Services Directory

Use this structure:

```txt
src/
  services/
    auth.service.ts
    user.service.ts
    subscription.service.ts
    deck-review.service.ts
    ai-review.service.ts
    ai-chat.service.ts
    storage.service.ts
    indexed-db.service.ts
    file.service.ts
    pdf.service.ts
```

## General Service Rules

* Every service must have one responsibility. Do not mix unrelated logic.
* Services must return typed results.
* All services return results in a uniform `ServiceResult<T>` structure.
* Expected errors should map to user-friendly errors, avoiding raw technical messages or stack traces in the UI.

## Result Pattern

For predictable error handling, services should return a common result shape:

```ts
export type ServiceResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };
```

Do not throw errors from services unless the error is truly unexpected. Expected errors should return `ServiceResult`.

---

## Auth Service

File:
```txt
services/auth.service.ts
```

Responsibility:
Integrates with **Supabase Auth** to manage user sessions and account security.

Methods:
* `signUp(input: SignUpInput): Promise<ServiceResult<AuthUser>>` — registers user in Supabase Auth (metadata includes name). Password and confirmPassword must match (confirmPassword is not stored or sent to DB).
* `signIn(input: SignInInput): Promise<ServiceResult<AuthUser>>` — authenticates user via email/password.
* `signOut(): Promise<ServiceResult<void>>` — terminates the Supabase Auth session.
* `getCurrentUser(): Promise<ServiceResult<AuthUser | null>>` — retrieves current session user and joins data with `profiles` table.
* `changePassword(input: ChangePasswordInput): Promise<ServiceResult<void>>` — updates user password in Supabase Auth.
* `deleteAccount(): Promise<ServiceResult<void>>` — requests account deletion via secure server-side API `/api/account/delete`.

---

## User Service

File:
```txt
services/user.service.ts
```

Responsibility:
Manages user profile data stored in the `profiles` table in Supabase DB.

Methods:
* `getCurrentProfile(): Promise<ServiceResult<UserProfile | null>>` — loads profile fields from Supabase.
* `updateProfile(data: UpdateProfileInput): Promise<ServiceResult<UserProfile>>` — updates user details (`company_name`, `industry`, `startup_stage`, `website`, `preferred_language`, etc.) in the database.

---

## Subscription Service

File:
```txt
services/subscription.service.ts
```

Responsibility:
Manages subscription plans, usages, and limits stored in the `subscriptions` table in Supabase DB.

Methods:
* `getCurrentSubscription(): Promise<ServiceResult<Subscription>>` — loads subscription status and review limits.
* `getPlans(): Promise<ServiceResult<Plan[]>>` — returns available plans list (based on static constants).
* `changePlan(planId: PlanId): Promise<ServiceResult<Subscription>>` — changes subscription plan and updates DB.
* `cancelSubscription(): Promise<ServiceResult<Subscription>>` — cancels subscription (updating billing status).
* `canRunReview(): Promise<ServiceResult<boolean>>` — verifies if user has remaining review slots.
* `incrementReviewUsage(): Promise<ServiceResult<void>>` — increments review usage counter upon successful review generation.

---

## Deck Review Service

File:
```txt
services/deck-review.service.ts
```

Responsibility:
Manages presentation reports and metadata stored in the `deck_reviews` table in Supabase DB.

Methods:
* `createDraft(input: CreateReviewInput): Promise<ServiceResult<DeckReview>>` — inserts draft review into `deck_reviews`.
* `saveReview(review: DeckReview): Promise<ServiceResult<DeckReview>>` — upserts completed report data.
* `getReviews(): Promise<ServiceResult<DeckReview[]>>` — loads user's reviews list from DB.
* `getReviewById(id: string): Promise<ServiceResult<DeckReview | null>>` — loads specific report details.
* `updateReview(id: string, data: Partial<DeckReview>): Promise<ServiceResult<DeckReview>>` — updates review status or details.
* `deleteReview(id: string): Promise<ServiceResult<void>>` — deletes review and cascades.
* `clearReviews(): Promise<ServiceResult<void>>` — deletes all user reviews from the cloud database.

---

## AI Review Service

File:
```txt
services/ai-review.service.ts
```

Responsibility:
Dispatches extraction text payload to the Next.js API route `/api/ai/review` for server-side processing.

---

## AI Chat Service

File:
```txt
services/ai-chat.service.ts
```

Responsibility:
Manages AI analysis chat messages stored in the `review_messages` table in Supabase DB.

Methods:
* `getMessages(reviewId: string): Promise<ServiceResult<ReviewChatMessage[]>>` — loads conversation messages history.
* `askQuestion(input: { ... }): Promise<ServiceResult<AIChatResponse>>` — posts user question to `/api/ai/chat` and saves both user and assistant messages to database.
* `clearMessages(reviewId: string): Promise<ServiceResult<void>>` — deletes messages for a specific review.

---

## Storage & Cache Services

### Storage Service (`services/storage.service.ts`)
No longer the source of truth for user profile, authentication, or subscriptions. Used strictly for UI preferences and non-sensitive cache (e.g., sidebar collapsed state, client theme preference).

### IndexedDB Service (`services/indexed-db.service.ts`)
Only acts as an optional client cache for faster startup, offline access, or transient draft files. Never used as the master data copy.

---

## Account Deletion Route

Endpoint:
```txt
/api/account/delete
```
* Executed server-side.
* Validates auth session.
* Deletes auth user via Supabase admin client (`SUPABASE_SERVICE_ROLE_KEY`).
* Cascades delete triggers on all database rows.

---

## Security Rules

* secrets like `OPENAI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` must only exist on the server.
* never expose secret variables as `NEXT_PUBLIC_*` or import them in client-side code.
* all user tables in Supabase Postgres must be protected by Row Level Security (RLS) policies.
