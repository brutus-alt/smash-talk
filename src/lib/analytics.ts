/**
 * Analytics — PostHog SDK intégré.
 *
 * Les 5 KPIs pilote (Arbitrages §7) :
 * - match_recorded
 * - session_outside_match_day
 * - league_active_weekly
 * - share_post_match
 * - match_recorder_distribution
 *
 * Si PostHog n'est pas configuré (pas de clé API), tout est loggé en console.
 * Aucun crash si le SDK n'est pas disponible.
 */

import PostHog from "posthog-react-native";

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
  | "app_opened"
  | "share_triggered";

type EventProperties = Record<string, string | number | boolean>;

// PostHog client — initialisé seulement si la clé est présente
const POSTHOG_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY ?? "";
const POSTHOG_HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

let posthogClient: PostHog | null = null;

if (POSTHOG_KEY) {
  try {
    posthogClient = new PostHog(POSTHOG_KEY, {
      host: POSTHOG_HOST,
      // Désactiver le tracking automatique des écrans — on le fait manuellement
      captureNativeAppLifecycleEvents: false,
    });
  } catch (err) {
    console.warn("[Analytics] PostHog init failed:", err);
  }
}

export const analytics = {
  /**
   * Tracker un événement.
   */
  track(event: EventName, properties?: EventProperties): void {
    if (__DEV__) {
      console.log(`[Analytics] ${event}`, properties ?? "");
    }

    if (posthogClient) {
      posthogClient.capture(event, properties);
    }
  },

  /**
   * Identifier un utilisateur (après login).
   */
  identify(userId: string, traits?: EventProperties): void {
    if (__DEV__) {
      console.log(`[Analytics] identify: ${userId}`, traits ?? "");
    }

    if (posthogClient) {
      posthogClient.identify(userId, traits);
    }
  },

  /**
   * Reset (après logout).
   */
  reset(): void {
    if (__DEV__) {
      console.log("[Analytics] reset");
    }

    if (posthogClient) {
      posthogClient.reset();
    }
  },

  /**
   * Flusher les événements en attente (avant fermeture app).
   */
  async flush(): Promise<void> {
    if (posthogClient) {
      await posthogClient.flush();
    }
  },
};
