// theme/animations.tsx
import React, { useEffect, useRef } from "react";
import { Animated, Easing, ViewStyle } from "react-native";

export function SlideUp({ children, distance=16, duration=280, delay=0, style }: { children: React.ReactNode; distance?: number; duration?: number; delay?: number; style?: ViewStyle; }) {
  const t = useRef(new Animated.Value(1)).current;   // position
  const o = useRef(new Animated.Value(0)).current;   // opacity
  useEffect(() => {
    Animated.parallel([
      Animated.timing(t, { toValue: 0, duration, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(o, { toValue: 1, duration, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [t, o, duration, delay]);
  return <Animated.View style={[{ opacity: o, transform:[{ translateY: t.interpolate({ inputRange:[0,1], outputRange:[0, distance] }) }] }, style]}>{children}</Animated.View>;
}

export function Float({ children, amplitude=4, duration=3000, style }: { children: React.ReactNode; amplitude?: number; duration?: number; style?: ViewStyle; }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(t, { toValue: 1, duration: duration/2, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(t, { toValue: 0, duration: duration/2, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, [t, duration]);
  return <Animated.View style={[{ transform:[{ translateY: t.interpolate({ inputRange:[0,1], outputRange:[-amplitude, amplitude] }) }] }, style]}>{children}</Animated.View>;
}
