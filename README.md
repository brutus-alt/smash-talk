# Smash Talk — Fondation technique

## Architecture retenue

**4 couches strictement séparées** (conforme Audit v2 + Architecture Technique) :

```
UI (écrans/composants) → Hooks (ponts React) → Domain (logique pure) → Services (Supabase CRUD)
                                               ↑
                                         Actions (orchestration)
```

- **UI** : composants React Native, écrans Expo Router, design system. Zéro logique métier.
- **Hooks** : ponts entre React et TanStack Query. Font 5-10 lignes max.
- **Actions** : fonctions async non-React qui orchestrent les cas d'usage (insert + badges + notif + analytics).
- **Domain** : fonctions pures TypeScript. Zéro dépendance React, zéro Supabase. Testables unitairement.
- **Services** : CRUD Supabase typé. Zéro logique métier.

## Arborescence

```
src/
  app/                        ← Expo Router (routes = fichiers)
    _layout.tsx               ← Root: providers + auth guard
    (auth)/
      _layout.tsx             ← Stack auth
      login.tsx               ← Apple/Google Sign-In + dev login
      onboarding.tsx          ← Pseudo + avatar + créer/rejoindre ligue
    (tabs)/
      _layout.tsx             ← 4 onglets + FAB
      home.tsx                ← Dashboard ligue (Tab 1 défaut)
      ranking.tsx             ← Classement individuel (Tab 2)
      history.tsx             ← Historique matchs (Tab 3)
      profile.tsx             ← Stats + badges (Tab 4)
    match/
      add.tsx                 ← Modale 3 étapes (placeholder Sprint 2)
    league/
      join.tsx                ← Rejoindre via code invitation
  components/ui/              ← Design system (8 composants)
    avatar.tsx                ← Initiales + cercle coloré
    badge-icon.tsx            ← Icône badge (grisé/coloré)
    button.tsx                ← Primary/secondary/danger
    card.tsx                  ← Conteneur surface
    empty-state.tsx           ← État vide avec CTA
    fab.tsx                   ← Bouton flottant + Match
    input.tsx                 ← Champ texte stylé
    stepper.tsx               ← +/- pour score
  domain/                     ← Logique métier pure
    types.ts                  ← Types dérivés (RankedPlayer, PlayerStats, etc.)
  services/
    supabase.ts               ← Client configuré + SecureStore
  actions/                    ← Vide (Sprint 2+)
  hooks/                      ← Vide (Sprint 2+)
  stores/
    auth.store.ts             ← Session + user + isLoading
    league.store.ts           ← activeLeagueId uniquement
  lib/
    analytics.ts              ← Stub PostHog (5 KPIs typés)
    constants.ts              ← 12 couleurs, limites, stale times
    query-client.ts           ← TanStack Query config
    query-keys.ts             ← Clés centralisées (leagueId inclus)
    utils.ts                  ← getInitials, getRandomPlayerColor, generateInviteCode
```

## Stack

| Brique | Choix | Version |
|--------|-------|---------|
| Framework | React Native + Expo | SDK 52 |
| Langage | TypeScript strict | 5.7 |
| Navigation | Expo Router | v4 |
| Styling | NativeWind (Tailwind) | v4 |
| Backend | Supabase | v2 |
| State serveur | TanStack Query | v5 |
| State local | Zustand | v5 |
| Formulaires | React Hook Form + Zod | RHF 7 + Zod 3 |
| Animations | Reanimated | v3 |
| Analytics | PostHog (stub) | — |

## Dépendances à installer

```bash
npx create-expo-app smash-talk --template blank-typescript
cd smash-talk
```

Puis remplacer le contenu par l'archive fournie, et lancer :

```bash
npx expo install \
  expo-router expo-linking expo-constants expo-status-bar \
  expo-secure-store expo-splash-screen expo-apple-authentication \
  react-native-screens react-native-safe-area-context \
  react-native-gesture-handler react-native-reanimated \
  @expo/vector-icons

npm install \
  @supabase/supabase-js \
  @tanstack/react-query \
  zustand \
  react-hook-form zod \
  nativewind tailwindcss \
  @react-native-async-storage/async-storage
```

## Configuration requise avant lancement

1. **Créer un fichier `.env`** à la racine (copier `.env.example`).
2. **Créer un projet Supabase** et récupérer URL + anon key.
3. **Placer des assets placeholder** dans `assets/` (icon.png, splash.png).

## Lancement

```bash
npx expo start
```

- Appuyer sur `i` pour iOS Simulator ou `a` pour Android Emulator.
- Le bouton "Dev Login" sur l'écran de connexion simule une session sans Supabase.

## Navigation

```
(auth)/login → Dev Login → (tabs)/home
                         → (tabs)/ranking
                         → (tabs)/history
                         → (tabs)/profile
                         → match/add (modale via FAB)
                         → league/join
```

## Design system

| Composant | Rôle | Props clés |
|-----------|------|-----------|
| `Button` | CTA principal | variant (primary/secondary/danger), size, isLoading, fullWidth |
| `Card` | Conteneur surface | elevated (bool) |
| `Avatar` | Initiales + couleur | initials, color, size (sm/md/lg) |
| `Stepper` | +/- score | value, onIncrement, onDecrement, min, max |
| `Input` | Champ texte | label, error + tous les TextInputProps |
| `EmptyState` | État vide | emoji, title, description, actionLabel, onAction |
| `FAB` | Bouton flottant | onPress |
| `BadgeIcon` | Badge profil | name, icon, earned |

## Prochaines étapes (Sprint 1 → 2)

1. **Créer le schéma SQL Supabase** : 7 tables + RLS + vue `league_player_summary` + seed 12 badges.
2. **Générer `database.types.ts`** depuis Supabase CLI.
3. **Implémenter les services CRUD** : auth, profiles, leagues, matches, badges.
4. **Implémenter `domain/`** : match-utils, match-validation, ranking, stats, badges.
5. **Brancher le vrai auth** : Apple Sign-In + Google Sign-In via Supabase.
6. **Créer les actions** : add-match, create-league, join-league.
7. **Créer les hooks TanStack Query** : useMatches, useRankings, useAddMatch, etc.

## Règles non négociables (rappel documents source)

- Un composant UI n'importe JAMAIS directement un service.
- Le classement est calculé dynamiquement, JAMAIS stocké.
- TypeScript strict : zéro `any`.
- Saisie de match < 30 secondes.
- Dark mode par défaut.
- 13 écrans max au MVP.
