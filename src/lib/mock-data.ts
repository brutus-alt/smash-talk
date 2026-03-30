/**
 * Données mock réalistes pour Smash Talk MVP.
 *
 * 8 joueurs, 1 ligue, 15 matchs, classement, badges.
 * Basé sur le persona "Nico" du PRD (34 ans, Marseille, joue 2-3x/semaine).
 *
 * Ces données seront remplacées par les vraies requêtes Supabase au Sprint 2.
 */

// ─── JOUEURS ───

export type MockPlayer = {
  id: string;
  pseudo: string;
  initials: string;
  color: string;
};

export const PLAYERS: MockPlayer[] = [
  { id: "p1", pseudo: "Nico", initials: "NI", color: "#3B82F6" },
  { id: "p2", pseudo: "Thomas", initials: "TH", color: "#22C55E" },
  { id: "p3", pseudo: "Marc", initials: "MA", color: "#EF4444" },
  { id: "p4", pseudo: "Julien", initials: "JU", color: "#F59E0B" },
  { id: "p5", pseudo: "Léa", initials: "LÉ", color: "#8B5CF6" },
  { id: "p6", pseudo: "Romain", initials: "RO", color: "#EC4899" },
  { id: "p7", pseudo: "Camille", initials: "CA", color: "#14B8A6" },
  { id: "p8", pseudo: "Sofiane", initials: "SO", color: "#F97316" },
];

export function getPlayer(id: string): MockPlayer {
  return PLAYERS.find((p) => p.id === id) ?? PLAYERS[0]!;
}

// ─── LIGUE ───

export type MockLeague = {
  id: string;
  name: string;
  emoji: string;
  inviteCode: string;
  memberCount: number;
  matchesThisWeek: number;
};

export const LEAGUE: MockLeague = {
  id: "league-1",
  name: "La Ligue du Jeudi",
  emoji: "⚡",
  inviteCode: "AB3K7YXZ",
  memberCount: 8,
  matchesThisWeek: 4,
};

// ─── MATCHS ───

export type MockMatch = {
  id: string;
  teamA: [string, string]; // player IDs
  teamB: [string, string];
  sets: { a: number; b: number }[];
  winner: "a" | "b";
  playedAt: string; // ISO date
  recordedBy: string;
};

export const MATCHES: MockMatch[] = [
  {
    id: "m1",
    teamA: ["p1", "p2"],
    teamB: ["p3", "p4"],
    sets: [{ a: 6, b: 4 }, { a: 6, b: 3 }],
    winner: "a",
    playedAt: "2026-03-24",
    recordedBy: "p1",
  },
  {
    id: "m2",
    teamA: ["p3", "p5"],
    teamB: ["p1", "p6"],
    sets: [{ a: 4, b: 6 }, { a: 6, b: 3 }, { a: 6, b: 4 }],
    winner: "a",
    playedAt: "2026-03-22",
    recordedBy: "p3",
  },
  {
    id: "m3",
    teamA: ["p1", "p2"],
    teamB: ["p5", "p7"],
    sets: [{ a: 6, b: 2 }, { a: 6, b: 1 }],
    winner: "a",
    playedAt: "2026-03-20",
    recordedBy: "p2",
  },
  {
    id: "m4",
    teamA: ["p4", "p8"],
    teamB: ["p3", "p6"],
    sets: [{ a: 3, b: 6 }, { a: 6, b: 4 }, { a: 4, b: 6 }],
    winner: "b",
    playedAt: "2026-03-19",
    recordedBy: "p4",
  },
  {
    id: "m5",
    teamA: ["p1", "p7"],
    teamB: ["p2", "p4"],
    sets: [{ a: 6, b: 3 }, { a: 6, b: 5 }],
    winner: "a",
    playedAt: "2026-03-17",
    recordedBy: "p1",
  },
  {
    id: "m6",
    teamA: ["p2", "p5"],
    teamB: ["p1", "p3"],
    sets: [{ a: 6, b: 7 }, { a: 6, b: 4 }, { a: 3, b: 6 }],
    winner: "b",
    playedAt: "2026-03-15",
    recordedBy: "p5",
  },
  {
    id: "m7",
    teamA: ["p6", "p8"],
    teamB: ["p1", "p2"],
    sets: [{ a: 2, b: 6 }, { a: 1, b: 6 }],
    winner: "b",
    playedAt: "2026-03-13",
    recordedBy: "p6",
  },
  {
    id: "m8",
    teamA: ["p1", "p4"],
    teamB: ["p3", "p7"],
    sets: [{ a: 6, b: 4 }, { a: 6, b: 2 }],
    winner: "a",
    playedAt: "2026-03-11",
    recordedBy: "p1",
  },
  {
    id: "m9",
    teamA: ["p5", "p6"],
    teamB: ["p2", "p8"],
    sets: [{ a: 4, b: 6 }, { a: 6, b: 3 }, { a: 5, b: 7 }],
    winner: "b",
    playedAt: "2026-03-10",
    recordedBy: "p2",
  },
  {
    id: "m10",
    teamA: ["p1", "p2"],
    teamB: ["p4", "p6"],
    sets: [{ a: 6, b: 0 }, { a: 6, b: 3 }],
    winner: "a",
    playedAt: "2026-03-08",
    recordedBy: "p1",
  },
];

// ─── CLASSEMENT ───

export type MockRanking = {
  rank: number;
  playerId: string;
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
  streak: number;
  streakType: "win" | "loss" | "none";
  movement: number; // +2, -1, 0
};

export const RANKINGS: MockRanking[] = [
  { rank: 1, playerId: "p1", matches: 9, wins: 7, losses: 2, winRate: 0.78, streak: 5, streakType: "win", movement: 0 },
  { rank: 2, playerId: "p2", matches: 8, wins: 6, losses: 2, winRate: 0.75, streak: 3, streakType: "win", movement: 1 },
  { rank: 3, playerId: "p3", matches: 7, wins: 4, losses: 3, winRate: 0.57, streak: 2, streakType: "win", movement: -1 },
  { rank: 4, playerId: "p5", matches: 5, wins: 2, losses: 3, winRate: 0.40, streak: 1, streakType: "loss", movement: 2 },
  { rank: 5, playerId: "p4", matches: 5, wins: 2, losses: 3, winRate: 0.40, streak: 1, streakType: "loss", movement: -1 },
  { rank: 6, playerId: "p7", matches: 4, wins: 2, losses: 2, winRate: 0.50, streak: 1, streakType: "win", movement: 0 },
  { rank: 7, playerId: "p6", matches: 5, wins: 1, losses: 4, winRate: 0.20, streak: 3, streakType: "loss", movement: -1 },
  { rank: 8, playerId: "p8", matches: 4, wins: 1, losses: 3, winRate: 0.25, streak: 2, streakType: "loss", movement: 0 },
];

// ─── BADGES ───

export type MockBadge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  earnedAt: string | null;
};

export const BADGES: MockBadge[] = [
  { id: "first_blood", name: "Premier Sang", description: "Enregistrer son premier match", icon: "🩸", category: "initiation", earnedAt: "2026-03-08" },
  { id: "marathon", name: "Marathonien", description: "Jouer 25 matchs", icon: "🏃", category: "volume", earnedAt: null },
  { id: "centurion", name: "Centurion", description: "Jouer 100 matchs", icon: "🏛️", category: "volume", earnedAt: null },
  { id: "win_machine", name: "Machine à gagner", description: "70% de victoires (min 10 matchs)", icon: "⚡", category: "performance", earnedAt: null },
  { id: "unstoppable", name: "Inarrêtable", description: "5 victoires consécutives", icon: "🔥", category: "serie", earnedAt: "2026-03-24" },
  { id: "legend", name: "Légende", description: "10 victoires consécutives", icon: "👑", category: "serie", earnedAt: null },
  { id: "humiliation", name: "Humiliation", description: "Gagner un set 6-0", icon: "💀", category: "moment", earnedAt: "2026-03-08" },
  { id: "comeback", name: "Comeback", description: "Gagner après avoir perdu le 1er set", icon: "🔄", category: "moment", earnedAt: null },
  { id: "summit", name: "Sommet", description: "Occuper la 1re place du classement", icon: "⛰️", category: "classement", earnedAt: "2026-03-15" },
  { id: "founder", name: "Fondateur", description: "Créer une ligue", icon: "🏗️", category: "social", earnedAt: "2026-03-08" },
  { id: "recruiter", name: "Recruteur", description: "Inviter 3 joueurs qui rejoignent", icon: "📢", category: "social", earnedAt: "2026-03-10" },
  { id: "rival", name: "Rival", description: "10 matchs contre le même adversaire", icon: "⚔️", category: "social", earnedAt: null },
];

// ─── RIVALITÉS (head-to-head) ───

export type MockRivalry = {
  playerAId: string;
  playerBId: string;
  playerAWins: number;
  playerBWins: number;
  totalMatches: number;
  lastMatchDate: string;
};

export const RIVALRIES: MockRivalry[] = [
  { playerAId: "p1", playerBId: "p3", playerAWins: 4, playerBWins: 2, totalMatches: 6, lastMatchDate: "2026-03-24" },
  { playerAId: "p1", playerBId: "p4", playerAWins: 3, playerBWins: 1, totalMatches: 4, lastMatchDate: "2026-03-17" },
  { playerAId: "p2", playerBId: "p5", playerAWins: 2, playerBWins: 2, totalMatches: 4, lastMatchDate: "2026-03-15" },
  { playerAId: "p3", playerBId: "p6", playerAWins: 3, playerBWins: 0, totalMatches: 3, lastMatchDate: "2026-03-19" },
];

// ─── HELPERS ───
// Source de vérité dans lib/utils.ts. Ré-exportés ici pour compatibilité.
export { formatScore, timeAgo } from "./utils";
