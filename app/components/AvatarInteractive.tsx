// AvatarInteractive.tsx
import React, { useRef } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  imageUrl: string;
  size?: number;
  onTapUpload: () => void;      // una tocada: abrir tab / picker para subir story
  onLongPreview: () => void;    // mantener: abrir modal con fondo difuminado
  showPlus?: boolean;           // muestra la cruz/plus
  plusSize?: number;
  delayLongPress?: number;      // ms
};

export default function AvatarInteractive({
  imageUrl,
  size = 72,
  onTapUpload,
  onLongPreview,
  showPlus = true,
  plusSize = 18,
  delayLongPress = 350,
}: Props) {
  const radius = size / 2;
  const longPressed = useRef(false);

  return (
    <Pressable
      onPress={() => {
        if (longPressed.current) return; // evita disparar tap después del long press
        onTapUpload();
      }}
      onLongPress={() => {
        longPressed.current = true;
        onLongPreview();
      }}
      onPressOut={() => {
        // resetea el flag al soltar
        longPressed.current = false;
      }}
      delayLongPress={delayLongPress}
      style={{ width: size, height: size }}
      accessibilityRole="imagebutton"
      accessibilityHint="Toca para subir historia. Mantén para previsualizar."
    >
      <Image
        source={imageUrl}
        style={{ width: size, height: size, borderRadius: radius, backgroundColor: "#eee" }}
        contentFit="cover"
        transition={150}
        cachePolicy="memory-disk"
      />

      {showPlus && (
        <View style={[styles.plusWrap, { width: plusSize + 6, height: plusSize + 6, borderRadius: (plusSize + 6) / 2 }]}>
          <Ionicons name="add" size={plusSize} color="#6D28D9" />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  plusWrap: {
    position: "absolute",
    right: -2,
    bottom: -2,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    // sombra leve
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
});
