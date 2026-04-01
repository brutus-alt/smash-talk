import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

import { Screen, SegmentedControl, SectionHeader, EmptyState } from "../../components/ui";
import { FadeInUp } from "../../components/ui/animated-view";
import { RankingRow } from "../../components/ranking-row";
import { useLeagueStore } from "../../stores/league.store";
import { useRankings } from "../../hooks/use-rankings";
import { useLeagueMembers } from "../../hooks/use-league-members";
import { useLeague } from "../../hooks/use-leagues";

type RankingView = "individual" | "pairs";

const SEGMENTS = [
  { value: "individual" as const, label: "Individuel" },
  { value: "pairs" as const, label: "Par paire" },
] as const;

export default function RankingScreen() {
  const router = useRouter();
  const activeLeagueId = useLeagueStore((s) => s.activeLeagueId);
  const [view, setView] = useState<RankingView>("individual");

  const { data: league } = useLeague(activeLeagueId);
  const { data: rankings, isLoading } = useRankings(activeLeagueId);
  const { data: members } = useLeagueMembers(activeLeagueId);

  const resolvePlayer = (userId: string) => {
    const p = members?.find((m) => m.user_id === userId)?.profile;
    return {
      pseudo: p?.pseudo ?? "???",
      initials: p?.initials ?? "??",
      color: p?.color ?? "#6B7280",
    };
  };

  if (!activeLeagueId) {
    return (
      <Screen>
        <EmptyState
          emoji="🏆"
          title="Pas encore dans l'arène"
          description="Rejoins une ligue pour voir qui écrase qui."
        />
      </Screen>
    );
  }

  return (
    <Screen mode="scroll">
      <SectionHeader title="Le classement" subtitle={league?.name ?? ""} />
      <SegmentedControl segments={SEGMENTS} value={view} onChange={setView} />

      {view === "individual" ? (
        isLoading ? (
          <View className="py-16 items-center">
            <ActivityIndicator color="#22C55E" />
          </View>
        ) : rankings && rankings.length > 0 ? (
          <View className="bg-surface-card rounded-xl overflow-hidden">
            {rankings.map((r, index) => {
              const p = resolvePlayer(r.userId);
              return (
                <FadeInUp key={r.userId} delay={index * 60}>
                  <RankingRow
                  key={r.userId}
                  rank={r.rank}
                  pseudo={p.pseudo}
                  initials={p.initials}
                  color={p.color}
                  matches={r.totalMatches}
                  wins={r.wins}
                  losses={r.losses}
                  winRate={r.winRate}
                  streak={r.currentStreak}
                  streakType={r.currentStreakType}
                  movement={0}
                  onPress={() => router.push(`/player/${r.userId}`)}
                />
                </FadeInUp>
              );
            })}
          </View>
        ) : (
          <EmptyState
            emoji="🏆"
            title="Tout reste à jouer"
            description="Encore quelques matchs et on saura qui est le patron. Min. 3 matchs pour entrer au classement."
          />
        )
      ) : (
        <EmptyState
          emoji="🤝"
          title="Les duos arrivent"
          description="Bientôt, tu pourras prouver que ta paire est imbattable. Patience."
        />
      )}
    </Screen>
  );
}
