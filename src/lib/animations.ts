/**
 * Kit d'animations — hooks réutilisables.
 *
 * Basé sur l'API Animated native de React Native.
 * Zéro dépendance externe. Performant (thread natif via useNativeDriver).
 *
 * Chaque hook retourne un style animé à appliquer sur un Animated.View.
 */

import { useEffect, useRef } from "react";
import { Animated, type ViewStyle } from "react-native";

/**
 * Fade in + slide up à l'apparition du composant.
 * Usage : entrée d'écran, apparition de cartes, empty states.
 */
export function useFadeInUp(
  delay: number = 0,
  duration: number = 400
): Animated.WithAnimatedObject<ViewStyle> {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return { opacity, transform: [{ translateY }] };
}

/**
 * Fade in simple (sans déplacement).
 * Usage : éléments qui apparaissent sans mouvement.
 */
export function useFadeIn(
  delay: number = 0,
  duration: number = 300
): Animated.WithAnimatedObject<ViewStyle> {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return { opacity };
}

/**
 * Scale bounce — effet de rebond à l'apparition.
 * Usage : badges débloqués, célébrations, FAB.
 */
export function useScaleBounce(
  delay: number = 0
): Animated.WithAnimatedObject<ViewStyle> {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      delay,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  return { transform: [{ scale }] };
}

/**
 * Pulse continu — pulsation légère qui se répète.
 * Usage : indicateur de série en cours, éléments qui attirent l'attention.
 */
export function usePulse(
  minScale: number = 0.95,
  maxScale: number = 1.05,
  duration: number = 1200
): Animated.WithAnimatedObject<ViewStyle> {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: maxScale,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: minScale,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return { transform: [{ scale }] };
}

/**
 * Stagger — anime des éléments en cascade avec un délai progressif.
 * Retourne une fonction qui donne le style pour chaque index.
 */
export function useStagger(
  count: number,
  staggerDelay: number = 80
): (index: number) => Animated.WithAnimatedObject<ViewStyle> {
  const animations = useRef(
    Array.from({ length: count }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(12),
    }))
  ).current;

  useEffect(() => {
    const anims = animations.map((anim, i) =>
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 350,
          delay: i * staggerDelay,
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration: 350,
          delay: i * staggerDelay,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.parallel(anims).start();
  }, [count]);

  return (index: number) => {
    const anim = animations[index];
    if (!anim) return {};
    return {
      opacity: anim.opacity,
      transform: [{ translateY: anim.translateY }],
    };
  };
}

/**
 * Press scale — réduit la taille au press, revient au relâchement.
 * Usage : boutons, cartes pressables.
 * Retourne { scale, onPressIn, onPressOut } à brancher sur le composant.
 */
export function usePressScale(scaleDown: number = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: scaleDown,
      friction: 8,
      tension: 200,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 150,
      useNativeDriver: true,
    }).start();
  };

  const style: Animated.WithAnimatedObject<ViewStyle> = {
    transform: [{ scale }],
  };

  return { style, onPressIn, onPressOut };
}
