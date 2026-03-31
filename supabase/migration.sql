-- ============================================================
-- SMASH TALK — Migration SQL complète
-- 7 tables + RLS + vue league_player_summary + seed 12 badges
-- Conforme : PRD v1, Arbitrages HoP, Audit v2, Architecture
-- ============================================================

-- ─── 1. PROFILES ───────────────────────────────────────────
-- Lié à auth.users via trigger. Un profil par utilisateur.

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  pseudo TEXT NOT NULL CHECK (char_length(pseudo) BETWEEN 3 AND 20),
  initials TEXT NOT NULL CHECK (char_length(initials) = 2),
  color TEXT NOT NULL CHECK (color ~ '^#[0-9A-Fa-f]{6}$'),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Tout utilisateur authentifié peut lire tous les profils
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT TO authenticated USING (true);

-- Un utilisateur ne peut modifier que son propre profil
CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Un utilisateur peut créer son propre profil
CREATE POLICY "profiles_insert" ON profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);


-- ─── 2. LEAGUES ────────────────────────────────────────────

CREATE TABLE leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 3 AND 30),
  emoji TEXT NOT NULL DEFAULT '⚡',
  invite_code TEXT NOT NULL UNIQUE CHECK (char_length(invite_code) = 8),
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;

-- Un utilisateur ne voit que les ligues dont il est membre
CREATE POLICY "leagues_select" ON leagues
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM league_members
      WHERE league_members.league_id = leagues.id
      AND league_members.user_id = auth.uid()
    )
  );

-- Tout utilisateur authentifié peut créer une ligue
CREATE POLICY "leagues_insert" ON leagues
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Seul le owner peut modifier la ligue
CREATE POLICY "leagues_update" ON leagues
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM league_members
      WHERE league_members.league_id = leagues.id
      AND league_members.user_id = auth.uid()
      AND league_members.role = 'owner'
    )
  );

-- Seul le owner peut supprimer la ligue
CREATE POLICY "leagues_delete" ON leagues
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM league_members
      WHERE league_members.league_id = leagues.id
      AND league_members.user_id = auth.uid()
      AND league_members.role = 'owner'
    )
  );


-- ─── 3. LEAGUE_MEMBERS ────────────────────────────────────

CREATE TABLE league_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  invited_by UUID REFERENCES profiles(id),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (league_id, user_id)
);

ALTER TABLE league_members ENABLE ROW LEVEL SECURITY;

-- Un utilisateur voit les membres des ligues auxquelles il appartient
CREATE POLICY "league_members_select" ON league_members
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM league_members lm
      WHERE lm.league_id = league_members.league_id
      AND lm.user_id = auth.uid()
    )
  );

-- Tout utilisateur authentifié peut rejoindre une ligue (via code)
CREATE POLICY "league_members_insert" ON league_members
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Un membre peut se retirer (quitter la ligue)
-- Un owner/admin peut retirer un membre
CREATE POLICY "league_members_delete" ON league_members
  FOR DELETE TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM league_members lm
      WHERE lm.league_id = league_members.league_id
      AND lm.user_id = auth.uid()
      AND lm.role IN ('owner', 'admin')
    )
  );


-- ─── 4. MATCHES ───────────────────────────────────────────
-- Modèle à plat : 4 joueurs + scores inline (Arbitrages §3, Architecture §7.4)
-- Pas de validation de score (les groupes jouent avec leurs règles)

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

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Un utilisateur ne voit que les matchs de ses ligues
CREATE POLICY "matches_select" ON matches
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM league_members
      WHERE league_members.league_id = matches.league_id
      AND league_members.user_id = auth.uid()
    )
  );

-- Tout membre de la ligue peut enregistrer un match
CREATE POLICY "matches_insert" ON matches
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM league_members
      WHERE league_members.league_id = matches.league_id
      AND league_members.user_id = auth.uid()
    )
  );

-- Pas d'UPDATE sur les matchs (décision Architecture §8.1)

-- Seul le owner/admin peut supprimer un match
CREATE POLICY "matches_delete" ON matches
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM league_members
      WHERE league_members.league_id = matches.league_id
      AND league_members.user_id = auth.uid()
      AND league_members.role IN ('owner', 'admin')
    )
  );


-- ─── 5. BADGES ────────────────────────────────────────────
-- Table de référence statique. 12 badges insérés au déploiement.

CREATE TABLE badges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('initiation', 'volume', 'performance', 'serie', 'moment', 'classement', 'social')),
  icon TEXT NOT NULL
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- Lecture publique (table de référence)
CREATE POLICY "badges_select" ON badges
  FOR SELECT TO authenticated USING (true);


-- ─── 6. USER_BADGES ──────────────────────────────────────

CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL REFERENCES badges(id),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, badge_id, league_id)
);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Un utilisateur voit les badges de tous les membres de ses ligues
CREATE POLICY "user_badges_select" ON user_badges
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM league_members
      WHERE league_members.league_id = user_badges.league_id
      AND league_members.user_id = auth.uid()
    )
  );

-- INSERT autorisé côté client avec contrainte doublon
-- Le risque de triche dans un groupe d'amis est négligeable (Arbitrages)
CREATE POLICY "user_badges_insert" ON user_badges
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);


-- ─── 7. PUSH_TOKENS ──────────────────────────────────────

CREATE TABLE push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

-- Un utilisateur ne voit que ses propres tokens
CREATE POLICY "push_tokens_select" ON push_tokens
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "push_tokens_insert" ON push_tokens
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "push_tokens_update" ON push_tokens
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "push_tokens_delete" ON push_tokens
  FOR DELETE TO authenticated USING (auth.uid() = user_id);


-- ─── VUE : LEAGUE_PLAYER_SUMMARY ─────────────────────────
-- Pré-agrège total_matches/wins/losses par joueur/ligue (Audit v2 §15)
-- Évite de charger tous les matchs côté client pour le classement

CREATE OR REPLACE VIEW league_player_summary AS
SELECT
  lm.league_id,
  lm.user_id,
  COUNT(m.id)::INT AS total_matches,
  COUNT(m.id) FILTER (WHERE
    (m.winner = 'team_a' AND (m.team_a_player_1 = lm.user_id OR m.team_a_player_2 = lm.user_id))
    OR
    (m.winner = 'team_b' AND (m.team_b_player_1 = lm.user_id OR m.team_b_player_2 = lm.user_id))
  )::INT AS wins,
  (COUNT(m.id) - COUNT(m.id) FILTER (WHERE
    (m.winner = 'team_a' AND (m.team_a_player_1 = lm.user_id OR m.team_a_player_2 = lm.user_id))
    OR
    (m.winner = 'team_b' AND (m.team_b_player_1 = lm.user_id OR m.team_b_player_2 = lm.user_id))
  ))::INT AS losses
FROM league_members lm
LEFT JOIN matches m ON m.league_id = lm.league_id
  AND (
    m.team_a_player_1 = lm.user_id OR m.team_a_player_2 = lm.user_id
    OR m.team_b_player_1 = lm.user_id OR m.team_b_player_2 = lm.user_id
  )
GROUP BY lm.league_id, lm.user_id;


-- ─── SEED : 12 BADGES ────────────────────────────────────
-- Liste exhaustive figée (Arbitrages §1.5)

INSERT INTO badges (id, name, description, category, icon) VALUES
  ('first_blood', 'Premier Sang', 'Enregistrer son premier match', 'initiation', '🩸'),
  ('marathon', 'Marathonien', 'Jouer 25 matchs', 'volume', '🏃'),
  ('centurion', 'Centurion', 'Jouer 100 matchs', 'volume', '🏛️'),
  ('win_machine', 'Machine à gagner', 'Atteindre 70% de victoires (min 10 matchs)', 'performance', '⚡'),
  ('unstoppable', 'Inarrêtable', '5 victoires consécutives', 'serie', '🔥'),
  ('legend', 'Légende', '10 victoires consécutives', 'serie', '👑'),
  ('humiliation', 'Humiliation', 'Gagner un set 6-0', 'moment', '💀'),
  ('comeback', 'Comeback', 'Gagner un match après avoir perdu le 1er set', 'moment', '🔄'),
  ('summit', 'Sommet', 'Occuper la 1re place du classement', 'classement', '⛰️'),
  ('founder', 'Fondateur', 'Créer une ligue', 'social', '🏗️'),
  ('recruiter', 'Recruteur', 'Inviter 3 joueurs qui rejoignent la ligue', 'social', '📢'),
  ('rival', 'Rival', 'Jouer 10 matchs contre le même adversaire', 'social', '⚔️');


-- ─── TRIGGER : CRÉER UN PROFIL À L'INSCRIPTION ───────────
-- Quand un utilisateur s'inscrit via Supabase Auth,
-- un profil vide est créé automatiquement.

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, pseudo, initials, color)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'pseudo', 'Joueur'),
    COALESCE(LEFT(UPPER(NEW.raw_user_meta_data->>'pseudo'), 2), '??'),
    '#3B82F6'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
