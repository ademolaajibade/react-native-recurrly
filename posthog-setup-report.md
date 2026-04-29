<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Recurly Expo app. Here is a summary of all changes made:

**New files created:**
- `app.config.js` — Expo config (replaces `app.json`) with PostHog token and host loaded from environment variables via `extras`
- `src/config/posthog.ts` — PostHog client singleton configured via `expo-constants`, with app lifecycle tracking, batching, and feature flag settings
- `.env` updated — `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` added

**Files edited:**
- `app/_layout.tsx` — Wrapped the app in `PostHogProvider` with autocapture enabled; added screen tracking via `posthog.screen()` on every route change using expo-router's `usePathname`
- `app/(auth)/sign-in.tsx` — Added `user_signed_in` event with `posthog.identify()` on success; `user_sign_in_failed` on error
- `app/(auth)/sign-up.tsx` — Added `user_signed_up`, `email_verification_sent`, `email_verified` events; `posthog.identify()` with `$set_once` signup date on verification
- `app/(tabs)/settings.tsx` — Added `user_signed_out` event and `posthog.reset()` before sign-out
- `app/(tabs)/index.tsx` — Added `subscription_expanded` and `subscription_collapsed` events with subscription ID and name properties
- `app/(tabs)/insights.tsx` — Added `insights_viewed` event on mount
- `app/subscriptions/[id].tsx` — Added `subscription_details_viewed` event with subscription ID on mount

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in with email and password | `app/(auth)/sign-in.tsx` |
| `user_sign_in_failed` | Sign-in attempt failed with an error | `app/(auth)/sign-in.tsx` |
| `user_signed_up` | User initiates account creation | `app/(auth)/sign-up.tsx` |
| `email_verification_sent` | Verification code sent to user's email | `app/(auth)/sign-up.tsx` |
| `email_verified` | User verified email and completed signup | `app/(auth)/sign-up.tsx` |
| `user_signed_out` | User signed out of their account | `app/(tabs)/settings.tsx` |
| `subscription_expanded` | User expanded a subscription card | `app/(tabs)/index.tsx` |
| `subscription_collapsed` | User collapsed an expanded subscription card | `app/(tabs)/index.tsx` |
| `subscription_details_viewed` | User viewed the subscription details page | `app/subscriptions/[id].tsx` |
| `insights_viewed` | User viewed the insights tab | `app/(tabs)/insights.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard** — [Analytics basics](https://us.posthog.com/project/402770/dashboard/1524541)
- **Sign-up Conversion Funnel** — [View insight](https://us.posthog.com/project/402770/insights/sXAUVvq2)
- **Daily Sign-ins** — [View insight](https://us.posthog.com/project/402770/insights/ux8iKLSZ)
- **Sign-in Failures** — [View insight](https://us.posthog.com/project/402770/insights/3o1BCyXv)
- **Subscription Engagement** — [View insight](https://us.posthog.com/project/402770/insights/yP8LNSNi)
- **User Retention** — [View insight](https://us.posthog.com/project/402770/insights/eIBCYMff)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
