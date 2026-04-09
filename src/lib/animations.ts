/**
 * Kit d'animations — hooks reutilisables.
 *
 * Base sur l'API Animated native de React Native.
 * Zero dependance externe. Performant (thread natif via useNativeDriver).
 *
 * Chaque hook retourne un style anime a appliquer sur un Animated.View.
 *
 * Philosophie premium :
 * - Utilise spring (pas timing) pour un feel naturel
 * - Stagger sur les listes pour rythme visuel
 * - Press scale sur tout ce qui est tappable
 */

import { useEffect, useRef } from "react";
import { Animated, type ViewStyle } from "react-native";

/**
 * Fade in + slide up a l'apparition.
 * Spring-based pour un feel premium (pas linaire).
 */
export function useFadeInUp(
  delay: number = 0,
  duration: number = 400
): Animated.WithAnimatedObject<ViewStyle> {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay,
        damping: 15,
        stiffness: 100,
        mass: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return { opacity, transform: [{ translateY }] };
}

/**
 * Fade in simple (sans deplacement).
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
 * Scale bounce — effet de rebond a l'apparition.
 * Usage : badges debloques, celebrations, hero elements.
 */
export function useScaleBounce(
  delay: number = 0
): Animated.WithAnimatedObject<ViewStyle> {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        delay,
        damping: 12,
        stiffness: 180,
        mass: 0.8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return { opacity, transform: [{ scale }] };
}

/**
 * Pulse continu — pulsation legere qui se repete.
 * Usage : indicateur de serie en cours, elements qui attirent l'attention.
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
 * Stagger — anime des elements en cascade.
 * Retourne une fonction qui donne le style pour chaque index.
 */
export function useStagger(
  count: number,
  staggerDelay: number = 80
): (index: number) => Animated.WithAnimatedObject<ViewStyle> {
  const animations = useRef(
    Array.from({ length: count }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(16),
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
        Animated.spring(anim.translateY, {
          toValue: 0,
          delay: i * staggerDelay,
          damping: 15,
          stiffness: 110,
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
 * Press scale — reduit la taille au press, revient au relachement.
 * Usage : boutons, cards pressables.
 * Spring-based, feeling tactile premium.
 */
export function usePressScale(scaleDown: number = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: scaleDown,
      damping: 18,
      stiffness: 350,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      damping: 12,
      stiffness: 180,
      useNativeDriver: true,
    }).start();
  };

  const style: Animated.WithAnimatedObject<ViewStyle> = {
    transform: [{ scale }],
  };

  return { style, onPressIn, onPressOut };
}
