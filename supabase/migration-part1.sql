CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  pseudo TEXT NOT NULL CHECK (char_length(pseudo) BETWEEN 3 AND 20),
  initials TEXT NOT NULL CHECK (char_length(initials) = 2),
  color TEXT NOT NULL CHECK (color ~ '^#[0-9A-Fa-f]{6}$'),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 3 AND 30),
  emoji TEXT NOT NULL DEFAULT '⚡',
  invite_code TEXT NOT NULL UNIQUE CHECK (char_length(invite_code) = 8),
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE league_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  invited_by UUID REFERENCES profiles(id),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (league_id, user_id)
);

CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  played_at DATE NOT NULL DEFAULT CURRENT_DATE,
  recorded_by UUID NOT NULL REFERENCES profiles(id),
  team_a_player_1 UUID NOT NULL REFERENCES profiles(id),
  team_a_player_2 UUID NOT NULL REFERENCES profiles(id),
  team_b_player_1 UUID NOT NULL REFERENCES profiles(id),
  team_b_player_2 UUID NOT NULL REFERENCES profiles(id),
  score_set_1_a SMALLINT NOT NULL DEFAULT 0,
  score_set_1_b SMALLINT NOT NULL DEFAULT 0,
  score_set_2_a SMALLINT NOT NULL DEFAULT 0,
  score_set_2_b SMALLINT NOT NULL DEFAULT 0,
  score_set_3_a SMALLINT,
  score_set_3_b SMALLINT,
  winner TEXT NOT NULL CHECK (winner IN ('team_a', 'team_b')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE badges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('initiation', 'volume', 'performance', 'serie', 'moment', 'classement', 'social')),
  icon TEXT NOT NULL
);

CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL REFERENCES badges(id),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, badge_id, league_id)
);

CREATE TABLE push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

5. Sauvegarde avec **Ctrl + S**

Puis dans le Terminal :
```
git add .
```
```
git commit -m "feat: add Supabase schema - 7 tables + RLS + badges seed"
```
```
git push