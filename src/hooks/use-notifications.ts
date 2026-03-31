/**
 * Hook : notifications push.
 *
 * Demande la permission, récupère le token Expo Push,
 * et l'enregistre dans Supabase (table push_tokens).
 *
 * Appelé une fois au montage de l'app (dans _layout.tsx ou Home).
 */

import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { useAuthStore } from "../stores/auth.store";
import { notificationsService } from "../services/notifications.service";

// Configuration : afficher les notifications même quand l'app est au premier plan
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Enregistre le push token auprès de Supabase.
 * À appeler une fois, après que l'utilisateur est connecté.
 */
export function useRegisterPushToken() {
  const userId = useAuthStore((s) => s.user?.id);
  const registered = useRef(false);

  useEffect(() => {
    if (!userId || registered.current) return;

    async function register() {
      try {
        // Demander la permission
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();

        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          console.log("[Notifications] Permission refusée");
          return;
        }

        // Récupérer le token Expo Push
        const tokenData = await Notifications.getExpoPushTokenAsync();
        const token = tokenData.data;

        if (!token) {
          console.warn("[Notifications] Pas de token");
          return;
        }

        // Enregistrer dans Supabase
        await notificationsService.registerToken({
          user_id: userId,
          token,
          platform: Platform.OS === "ios" ? "ios" : "android",
        });

        registered.current = true;
        console.log("[Notifications] Token enregistré");
      } catch (err) {
        // Best effort — ne pas bloquer l'app si les notifs échouent
        console.warn("[Notifications] Erreur:", err);
      }
    }

    register();
  }, [userId]);
}

/**
 * Écoute les notifications reçues (foreground + tap).
 * Retourne la dernière notification reçue.
 */
export function useNotificationListener() {
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    // Notification reçue pendant que l'app est ouverte
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("[Notifications] Reçue:", notification.request.content.title);
      });

    // L'utilisateur tape sur la notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("[Notifications] Tap:", response.notification.request.content.data);
        // TODO: naviguer vers le match ou la ligue concernée
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);
}
