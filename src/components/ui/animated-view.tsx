import { Animated } from "react-native";
import type { ReactNode } from "react";
import { useFadeInUp, useFadeIn, useScaleBounce } from "../../lib/animations";

/**
 * Composants wrapper d'animation.
 * S'utilisent comme des <View> normaux mais avec une animation d'entrée.
 *
 * Usage :
 *   <FadeInUp delay={100}>
 *     <Card>...</Card>
 *   </FadeInUp>
 */

type AnimatedWrapperProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
};

/** Fade in + slide up */
export function FadeInUp({ children, delay = 0, duration = 400 }: AnimatedWrapperProps) {
  const style = useFadeInUp(delay, duration);
  return <Animated.View style={style}>{children}</Animated.View>;
}

/** Fade in simple */
export function FadeIn({ children, delay = 0, duration = 300 }: AnimatedWrapperProps) {
  const style = useFadeIn(delay, duration);
  return <Animated.View style={style}>{children}</Animated.View>;
}

/** Scale bounce (apparition avec rebond) */
export function ScaleBounce({ children, delay = 0 }: Omit<AnimatedWrapperProps, "duration">) {
  const style = useScaleBounce(delay);
  return <Animated.View style={style}>{children}</Animated.View>;
}
