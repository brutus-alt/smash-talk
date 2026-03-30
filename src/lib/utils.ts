import { PLAYER_COLORS } from "./constants";

/**
 * Retourne une couleur aléatoire du pool de 12 couleurs.
 * Utilisé à la création du profil joueur (Arbitrages §1.6).
 */
export function getRandomPlayerColor(): string {
  const index = Math.floor(Math.random() * PLAYER_COLORS.length);
  return PLAYER_COLORS[index] ?? PLAYER_COLORS[0]!;
}

/**
 * Génère les initiales depuis un pseudo (2 caractères max).
 * Ex : "Nico" → "NI", "Marc-Antoine" → "MA"
 */
export function getInitials(pseudo: string): string {
  const cleaned = pseudo.trim();
  if (cleaned.length === 0) return "??";

  const parts = cleaned.split(/[\s\-_]+/);
  if (parts.length >= 2) {
    return (
      (parts[0]?.[0] ?? "").toUpperCase() +
      (parts[1]?.[0] ?? "").toUpperCase()
    );
  }

  return cleaned.slice(0, 2).toUpperCase();
}

/**
 * Génère un code d'invitation alphanumérique.
 * Utilisé côté client comme fallback si le serveur ne le génère pas.
 */
export function generateInviteCode(length: number = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sans I/O/1/0 pour éviter confusion
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * Format de score lisible : "6-4 / 6-3"
 * Fonction pure — survit au-delà des mocks.
 */
export function formatScore(sets: { a: number; b: number }[]): string {
  return sets.map((s) => `${s.a}-${s.b}`).join(" / ");
}

/**
 * Temps relatif simplifié : "Aujourd'hui", "Hier", "Il y a 3 jours"
 * Fonction pure — survit au-delà des mocks.
 */
export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} sem.`;
  return `Il y a ${Math.floor(diffDays / 30)} mois`;
}
