// StoryItem.tsx
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type StoryUser = {
  id: string;
  name: string;
  avatarUrl?: string;
  hasUnseen?: boolean;
  isOwn?: boolean;
};

type Props = {
  user: StoryUser;
  size?: number;              // diámetro del avatar
  ringWidth?: number;         // grosor del aro (deprecated, usa borderPercent)
  borderPercent?: number;     // porcentaje del diámetro total que es borde de color (0-0.5)
  onPress?: (user: StoryUser) => void;
};

const FALLBACK =
  "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";

const StoryItem = memo(({ user, size = 64, ringWidth = 3, borderPercent = 0.12, onPress }: Props) => {
  // borderPercent: 0.12 = 12% del diámetro total es borde de color
  // Si ringWidth se pasa, tiene prioridad borderPercent
  const border = Math.max(1, Math.round((size) * (borderPercent > 0 && borderPercent < 0.5 ? borderPercent : 0.12)));
  const totalSize = size + border * 2;
  const radius = size / 2;
  const totalRadius = totalSize / 2;

  const ringColors: [string, string, ...string[]] = user.hasUnseen
    ? ["#F58529", "#DD2A7B", "#8134AF", "#515BD4"] // gradiente IG-ish
    : ["#E5E7EB", "#E5E7EB"]; // gris si visto

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(user)}
      accessibilityRole="button"
      accessibilityLabel={`${user.name} story`}
    >
      <LinearGradient
        colors={ringColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.ring,
          { width: totalSize, height: totalSize, borderRadius: totalRadius },
        ]}
      >
        <Image
          source={user.avatarUrl || FALLBACK}
          style={{ width: size, height: size, borderRadius: radius }}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />
        {user.isOwn && (
          <View style={styles.plusBadge}>
            <Text style={styles.plusText}>＋</Text>
          </View>
        )}
      </LinearGradient>

      <Text style={styles.name} numberOfLines={1}>
        {user.name}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: { width: 80, alignItems: "center" },
  ring: { alignItems: "center", justifyContent: "center" },
  // avatarWrap eliminado, ya no se usa
  name: { marginTop: 6, fontSize: 12, color: "#111827", maxWidth: 70 },
  plusBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  plusText: { fontSize: 14, lineHeight: 14, color: "#6D28D9", fontWeight: "700" },
});

export default StoryItem;
