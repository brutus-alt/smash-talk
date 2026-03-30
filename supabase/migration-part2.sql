-- ============================================================
-- SMASH TALK — PARTIE 2 : RLS + VUE + SEED + TRIGGER
-- Exécuter APRÈS la partie 1
-- ============================================================

-- ─── RLS : PROFILES ───
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- ─── RLS : LEAGUES ───
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leagues_select" ON leagues FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM league_members WHERE league_members.league_id = leagues.id AND league_members.user_id = auth.uid()));
CREATE POLICY "leagues_insert" ON leagues FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);
CREATE POLICY "leagues_update" ON leagues FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM league_members WHERE league_members.league_id = leagues.id AND league_members.user_id = auth.uid() AND league_members.role = 'owner'));
CREATE POLICY "leagues_delete" ON leagues FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM league_members WHERE league_members.league_id = leagues.id AND league_members.user_id = auth.uid() AND league_members.role = 'owner'));

-- ─── RLS : LEAGUE_MEMBERS ───
ALTER TABLE league_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "league_members_select" ON league_members FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM league_members lm WHERE lm.league_id = league_members.league_id AND lm.user_id = auth.uid()));
CREATE POLICY "league_members_insert" ON league_members FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "league_members_delete" ON league_members FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM league_members lm WHERE lm.league_id = league_members.league_id AND lm.user_id = auth.uid() AND lm.role IN ('owner', 'admin')));

-- ─── RLS : MATCHES ───
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "matches_select" ON matches FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM league_members WHERE league_members.league_id = matches.league_id AND league_members.user_id = auth.uid()));
CREATE POLICY "matches_insert" ON matches FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM league_members WHERE league_members.league_id = matches.league_id AND league_members.user_id = auth.uid()));
CREATE POLICY "matches_delete" ON matches FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM league_members WHERE league_members.league_id = matches.league_id AND league_members.user_id = auth.uid() AND league_members.role IN ('owner', 'admin')));

-- ─── RLS : BADGES ───
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "badges_select" ON badges FOR SELECT TO authenticated USING (true);

-- ─── RLS : USER_BADGES ───
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_badges_select" ON user_badges FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM league_members WHERE league_members.league_id = user_badges.league_id AND league_members.user_id = auth.uid()));
CREATE POLICY "user_badges_insert" ON user_badges FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ─── RLS : PUSH_TOKENS ───
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "push_tokens_select" ON push_tokens FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "push_tokens_insert" ON push_tokens FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "push_tokens_update" ON push_tokens FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "push_tokens_delete" ON push_tokens FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ─── VUE : LEAGUE_PLAYER_SUMMARY ───
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

-- ─── SEED : 12 BADGES ───
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

-- ─── TRIGGER : CRÉER UN PROFIL À L'INSCRIPTION ───
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
