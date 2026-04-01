/**
 * Feedback haptique — wrappers légers.
 *
 * Déclenche une vibration subtile sur les actions clés (Arbitrages §6.4).
 * Graceful fallback si expo-haptics n'est pas disponible.
 */

let Haptics: typeof import("expo-haptics") | null = null;

try {
  Haptics = require("expo-haptics");
} catch {
  // expo-haptics non disponible (web, simulateur sans support)
}

/** Feedback léger — sélection d'un joueur, tap sur une carte */
export function hapticLight() {
  Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

/** Feedback moyen — validation de match, changement d'étape */
export function hapticMedium() {
  Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}

/** Feedback fort — déblocage de badge, célébration */
export function hapticHeavy() {
  Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
}

/** Feedback succès — match validé, ligue créée */
export function hapticSuccess() {
  Haptics?.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

/** Feedback erreur — action refusée */
export function hapticError() {
  Haptics?.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
}
