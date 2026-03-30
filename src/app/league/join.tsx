import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { ModalHeader, Button, Input, Card } from "../../components/ui";

/**
 * Rejoindre une ligue via code d'invitation.
 * Mock : affiche un aperçu de la ligue quand le code fait 8 caractères.
 */
export default function JoinLeagueScreen() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const isCodeComplete = code.trim().length === 8;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ModalHeader
        title="Rejoindre une ligue"
        onClose={() => router.back()}
      />

      <View className="flex-1 px-6 gap-6 pt-4">
        <Text className="text-text-secondary text-base">
          Entre le code d'invitation que ton pote t'a envoyé.
        </Text>

        <Input
          label="Code d'invitation"
          placeholder="Ex : AB3K7YXZ"
          value={code}
          onChangeText={(text) => setCode(text.toUpperCase())}
          maxLength={8}
          showCount
          autoCapitalize="characters"
          autoCorrect={false}
          autoFocus
        />

        {/* Mock league preview when code is complete */}
        {isCodeComplete ? (
          <Card variant="elevated">
            <Text className="text-text-muted text-xs mb-2">Ligue trouvée</Text>
            <View className="flex-row items-center gap-3">
              <Text className="text-3xl">⚡</Text>
              <View>
                <Text className="text-text text-lg font-bold">La Ligue du Jeudi</Text>
                <Text className="text-text-muted text-sm">8 joueurs · 42 matchs</Text>
              </View>
            </View>
          </Card>
        ) : null}

        <View className="mt-auto mb-8">
          <Button
            title="Rejoindre"
            size="lg"
            fullWidth
            disabled={!isCodeComplete}
            onPress={() => {
              // TODO: joinLeagueAction
              router.back();
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
