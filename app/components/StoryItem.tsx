import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/app/../theme/theme"; // <- tus tokens

export type StoryUser = {
  id: string;
  name: string;
  avatarUrl?: string;
  hasUnseen?: boolean; // si tiene stories nuevas → aro de color
  isOwn?: boolean;     // si es tuyo → muestra "+"
  online?: boolean;    // punto verde
};

type Props = {
  user: StoryUser;
  size?: number;              // diámetro de la foto
  borderPercent?: number;     // 0..0.5 del diámetro que ocupa el ring
  onPress?: (user: StoryUser) => void;
};

const FALLBACK =
  "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";

const StoryItem = memo(({ user, size = 64, borderPercent = 0.12, onPress }: Props) => {
  const border = Math.max(1, Math.round(size * (borderPercent > 0 && borderPercent < 0.5 ? borderPercent : 0.12)));
  const totalSize = size + border * 2;
  const radius = size / 2;
  const totalRadius = totalSize / 2;
  const { colors: c } = useTheme();

  // Gradiente IG solo si hay stories sin ver — si no, borde gris suave
  const ringColors: [string, string, ...string[]] = user.hasUnseen
    ? ["#F58529", "#DD2A7B", "#8134AF", "#515BD4"]
    : [c.accent[300], c.accent[300]]; // gris suave del token

  return (
    <TouchableOpacity
      style={[styles.container, { width: totalSize + 16 }]}
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
        {/* aro interno blanco con borde súper sutil */}
        <View
          style={{
            width: totalSize - 2,
            height: totalSize - 2,
            borderRadius: totalRadius - 1,
            backgroundColor: c.card.DEFAULT,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: c.accent[300],
          }}
        >
          <Image
            source={user.avatarUrl || FALLBACK}
            style={{ width: size, height: size, borderRadius: radius }}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
        </View>

        {/* online dot */}
        {user.online && (
          <View
            style={{
              position: "absolute",
              right: 6,
              top: 6,
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: c.success.DEFAULT,
              borderWidth: 2,
              borderColor: c.card.DEFAULT,
            }}
          />
        )}

        {/* botón flotante + para “Tu” */}
        {user.isOwn && (
          <View
            style={{
              position: "absolute",
              right: -2,
              bottom: -2,
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: c.primary.DEFAULT,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: c.card.DEFAULT,
            }}
          >
            <Text style={{ color: c.primary.foreground, fontSize: 16, lineHeight: 16, fontWeight: "800" }}>＋</Text>
          </View>
        )}
      </LinearGradient>

      <Text
        style={{
          marginTop: 6,
          fontSize: 12,
          fontWeight: "600",
          color: c.foreground,
          maxWidth: 70,
        }}
        numberOfLines={1}
      >
        {user.name}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  ring: {
    alignItems: "center",
    justifyContent: "center",
    // sombra suave para dar volumen
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});

export default StoryItem;
