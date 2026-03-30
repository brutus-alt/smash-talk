# Smash Talk — Contexte projet pour Claude Code

## Identité produit

Smash Talk (nom de travail : PadelRivals) est une app mobile de ligue privée de padel entre amis.
Positionnement : la couche sociale, émotionnelle et compétitive au-dessus du jeu. Ce n'est pas une app de réservation, ni de coaching, ni un réseau social ouvert.
Promesse : « Chaque match compte. Chaque rivalité vit. Chaque groupe a son histoire. »
Ton : complice, légèrement irrévérencieux, jamais corporate, jamais enfantin. Premium et fun.

## Cible

Groupes de 4-12 amis jouant au padel 2+ fois/mois. 25-45 ans, urbains, France. Esprit compétitif amical.

## Boucle d'engagement

jouer → enregistrer le match (<30 sec) → consulter classement → chambrer → rejouer

## Stack technique

- React Native + Expo SDK 52+ (cross-platform)
- TypeScript strict (zéro `any`)
- Expo Router v4 (file-based routing)
- NativeWind v4 (Tailwind pour React Native)
- Supabase (Postgres + Auth + Edge Functions)
- TanStack Query v5 (cache serveur)
- Zustand v5 (état UI minimal)
- React Hook Form + Zod (formulaires)
- Reanimated 3 (animations)
- PostHog (analytics, branché plus tard)

## Architecture — 4 couches strictement séparées

```
UI (écrans/composants) → Hooks (ponts React ↔ TanStack Query)
                                    ↓
                         Actions (orchestration async, zéro React)
                                    ↓
                    Domain (logique pure, zéro dépendance) + Services (CRUD Supabase)
```

Règle absolue : un composant UI n'importe JAMAIS directement un service Supabase.

## Arborescence

```
src/
  app/                    ← Expo Router (fichiers = routes)
    _layout.tsx           ← Root: providers + auth guard
    (auth)/ login.tsx, onboarding.tsx
    (tabs)/ home.tsx, ranking.tsx, history.tsx, profile.tsx
    match/ add.tsx
    league/ join.tsx
  components/ui/          ← Design system (15 composants, zéro logique métier)
  domain/                 ← Logique métier pure (types.ts + futur: ranking, stats, badges, match-utils)
  services/               ← CRUD Supabase (supabase.ts + futur: auth, profiles, leagues, matches, badges)
  actions/                ← Orchestration cas d'usage (futur: add-match, create-league, join-league)
  hooks/                  ← Ponts TanStack Query (futur: use-matches, use-rankings, etc.)
  stores/                 ← Zustand (auth.store.ts, league.store.ts)
  lib/                    ← Utilitaires (constants, theme, query-keys, query-client, analytics, utils)
```

## Modèle de données (7 tables Supabase)

- **profiles** : id (=auth.users.id), pseudo, initials, color, avatar_url (null MVP), created_at
- **leagues** : id, name, emoji, invite_code (8 car unique), created_by, created_at
- **league_members** : id, league_id, user_id, role (owner/admin/member), invited_by (nullable), joined_at
- **matches** : id, league_id, played_at (date), recorded_by, team_a_player_1/2, team_b_player_1/2, score_set_1/2/3_a/b, winner (team_a/team_b), created_at
- **badges** : id (slug), name, description, category, icon — table statique seed 12 lignes
- **user_badges** : id, user_id, badge_id, league_id, earned_at
- **push_tokens** : id, user_id, token, platform, created_at

Le classement est CALCULÉ dynamiquement depuis les matchs, JAMAIS stocké (non négociable).
Vue SQL `league_player_summary` pré-agrège total_matches/wins/losses par joueur/ligue.

## Décisions produit clés (Arbitrages HoP)

- Classement = ratio victoires/matchs. Pas d'Elo au MVP. Min 3 matchs pour apparaître. Départage par nombre de victoires.
- Classement individuel = P0. Par paire = P1 (hypothèse paires stables non validée).
- 12 badges figés : Premier Sang, Marathonien, Centurion, Machine à gagner, Inarrêtable, Légende, Humiliation, Comeback, Sommet (=1re place), Fondateur, Recruteur, Rival.
- Badges scindés : 9 immédiats (post-match) + 3 différés (Fondateur, Recruteur, Sommet).
- Avatar = initiales + couleur (pool 12 couleurs). Pas de bibliothèque illustrée.
- Pas de validation de score (groupes jouent avec leurs règles).
- Défis = texte libre P2, pas de tracking auto.
- Partage = 2 templates exactement (résumé match 9:16+1:1, classement top 5).
- 13 écrans max au total.
- Auth = Apple Sign-In + Google Sign-In uniquement (pas d'email/password MVP).
- iOS d'abord, Android décalé 4-6 semaines.
- MVP gratuit, aucune monétisation.
- Notifications = Edge Function appelée depuis l'action client (pas de database webhook).

## Design system — Conventions

### Palette (dark-first)
- Surface : #0A0A0F (base), #13131D (card), #1C1C2B (elevated), #2A2A3D (border)
- Accent (victoire/CTA) : #22C55E + light/dark/muted
- Danger (défaite) : #EF4444 + light/dark/muted
- Warning (streak) : #F59E0B + light/dark/muted
- Text : #F1F1F6 (primary), #9CA3AF (secondary), #6B7280 (muted)

### 15 composants UI disponibles
Screen, ModalHeader, Divider, Button (primary/secondary/danger/ghost), FAB, Input, Stepper, SegmentedControl, Card (default/elevated/outlined/pressable), Avatar (xs→xl + ring), Pill, BadgeIcon, StatRow, SectionHeader, EmptyState

### Règles
- Toujours utiliser `<Screen>` comme wrapper d'écran tab (pas SafeAreaView direct)
- Modales utilisent SafeAreaView + ModalHeader
- Couleurs : classes Tailwind en priorité, `lib/theme.ts` pour le programmatique
- Texte interactif minimum 16pt
- Chiffres scores/classements en tabular-nums
- Dark mode = seul mode MVP
- Maximum 2 familles de police

## Plan de build (12 étapes — Audit v2 §17)

1. ✅ Init Expo + TS strict + Expo Router + NativeWind + arborescence
2. → SQL Supabase : 7 tables + RLS + vue league_player_summary + seed 12 badges
3. → lib/ : database.types.ts (généré) + domain/types.ts + query-keys.ts + constants.ts
4. → domain/ : match-utils.ts + match-validation.ts + ranking.ts + stats.ts + badges.ts
5. → services/ : tous les .service.ts
6. → actions/ + hooks/ + stores/
7. ✅ components/ui/ : 15 composants design system
8. → Auth (Apple/Google) + onboarding + navigation auth → tabs
9. → Création ligue + invitation + join + écrans tabs avec empty states
10. → Modale ajout match + historique + classement + profil + H2H
11. → Badges (détection post-match + animation) + cartes partageables
12. → Notifications push + analytics PostHog

## Règles non négociables

- TypeScript strict, zéro `any`
- Un composant UI n'importe jamais un service
- Le classement est calculé dynamiquement, jamais stocké
- Saisie de match < 30 secondes
- RLS actif dès le premier déploiement
- Pas de normalisation excessive du modèle matches (modèle à plat)
- Pas de lib UI externe (design system custom)
- Pas de Redux, pas de GraphQL, pas de Firebase

## Rejets explicites (hors scope MVP)

Mode tournoi, réservation terrain, commentaires/réactions sur matchs, photos de match, app web, règles de scoring custom par ligue, chat intégré, stats avancées (aces, fautes), ligues publiques, multi-sport, mode hors-ligne riche.
