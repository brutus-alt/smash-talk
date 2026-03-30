/**
 * Analytics wrapper — PostHog sera branché ici en Sprint 6.
 * Pour l'instant, log en console en dev uniquement.
 *
 * Les 5 KPIs pilote (Arbitrages §7) :
 * - match_recorded
 * - session_outside_match_day
 * - league_active_weekly
 * - share_post_match
 * - match_recorder_distribution
 */

type EventName =
  | "match_recorded"
  | "session_outside_match_day"
  | "league_active_weekly"
  | "share_post_match"
  | "match_recorder_distribution"
  | "league_created"
  | "league_joined"
  | "badge_earned"
  | "onboarding_completed"
  | "app_opened";

type EventProperties = Record<string, string | number | boolean>;

export const analytics = {
  track(event: EventName, properties?: EventProperties): void {
    if (__DEV__) {
      console.log(`[Analytics] ${event}`, properties ?? "");
    }
    // TODO: PostHog SDK call ici
  },

  identify(userId: string, traits?: EventProperties): void {
    if (__DEV__) {
      console.log(`[Analytics] identify: ${userId}`, traits ?? "");
    }
    // TODO: PostHog identify
  },

  reset(): void {
    if (__DEV__) {
      console.log("[Analytics] reset");
    }
    // TODO: PostHog reset
  },
};
