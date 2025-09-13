// CategoryPill.tsx
import React, { memo } from "react";
import { Text, View, TouchableOpacity, StyleSheet, GestureResponderEvent } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type IconPack = "ion" | "mci";

type IconSpec = {
  pack: IconPack;
  name: string;
  color: string;
};

type PillPreset = {
  icon: IconSpec;
  textColor?: string;
  bgColor?: string;
  borderColor?: string;
};

const PRESETS: Record<string, PillPreset> = {
  // keys en minúscula para normalizar
  "all":         { icon: { pack: "ion", name: "ellipse-outline", color: "#9AA3AF" }, textColor:"#111827", bgColor:"#F3F4F6", borderColor:"#E5E7EB" },
  "chill":       { icon: { pack: "ion", name: "cafe-outline",     color: "#3B82F6" }, textColor:"#1F2937", bgColor:"#EFF6FF", borderColor:"#DBEAFE" },
  "go out":      { icon: { pack: "ion", name: "flash-outline",    color: "#F59E0B" }, textColor:"#1F2937", bgColor:"#FFFBEB", borderColor:"#FDE68A" },
  "romantic":    { icon: { pack: "ion", name: "heart-outline",    color: "#EC4899" }, textColor:"#1F2937", bgColor:"#FDF2F8", borderColor:"#FBCFE8" },
  "active":      { icon: { pack: "ion", name: "bicycle-outline",  color: "#10B981" }, textColor:"#064E3B", bgColor:"#ECFDF5", borderColor:"#A7F3D0" },
  "creative":    { icon: { pack: "mci", name: "palette-outline",  color: "#8B5CF6" }, textColor:"#1F2937", bgColor:"#F5F3FF", borderColor:"#DDD6FE" },
  "wellness":    { icon: { pack: "ion", name: "leaf-outline",     color: "#16A34A" }, textColor:"#065F46", bgColor:"#ECFDF5", borderColor:"#BBF7D0" },
  "sightseeing": { icon: { pack: "ion", name: "camera-outline",   color: "#0891B2" }, textColor:"#0C4A6E", bgColor:"#ECFEFF", borderColor:"#A5F3FC" },
  "social": {icon: { pack: "ion", name: "people-outline",   color: "#F97316" }, textColor:"#1F2937", bgColor:"#FFFAF0", borderColor:"#FED7AA" },
};

export type CategoryPillProps = {
  /** Texto a mostrar; también se usa para buscar preset (case-insensitive) */
  label: string;
  /** Marca de selección/activo */
  selected?: boolean;
  /** Callback al tocar */
  onPress?: (e: GestureResponderEvent) => void;
  /** Deshabilitado */
  disabled?: boolean;

  /** Overrides opcionales (si querés ignorar el diccionario) */
  iconOverride?: IconSpec;
  textColor?: string;
  bgColor?: string;
  borderColor?: string;

  /** Ajustes visuales */
  size?: "sm" | "md" | "lg";
  rounded?: number; // radio opcional
};

const sizeTokens = {
  sm: { padH: 10, padV: 6, icon: 14, gap: 6, text: 12 },
  md: { padH: 12, padV: 8, icon: 16, gap: 8, text: 14 },
  lg: { padH: 14, padV: 10, icon: 18, gap: 8, text: 16 },
};

const renderIcon = (icon: IconSpec, size: number) => {
  if (icon.pack === "ion") return <Ionicons name={icon.name as any} size={size} color={icon.color} />;
  return <MaterialCommunityIcons name={icon.name as any} size={size} color={icon.color} />;
};

const CategoryPill = memo<CategoryPillProps>((props) => {
  const {
    label,
    selected = false,
    onPress,
    disabled = false,
    iconOverride,
    textColor,
    bgColor,
    borderColor,
    size = "md",
    rounded,
  } = props;

  const key = label.trim().toLowerCase();
  const preset = PRESETS[key];

  const token = sizeTokens[size];
  const iconSpec: IconSpec =
    iconOverride ??
    preset?.icon ?? { pack: "ion", name: "pricetag-outline", color: "#6B7280" };

  const baseBg = bgColor ?? preset?.bgColor ?? "#F3F4F6";
  const baseBorder = borderColor ?? preset?.borderColor ?? "#E5E7EB";
  const baseText = textColor ?? preset?.textColor ?? "#111827";

  const selBg = selected ? "white" : baseBg;
  const selBorder = selected ? iconSpec.color : baseBorder;
  const selText = selected ? iconSpec.color : baseText;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.pill,
        {
          paddingHorizontal: token.padH,
          paddingVertical: token.padV,
          borderRadius: rounded ?? 999,
          backgroundColor: selBg,
          borderColor: selBorder,
          opacity: disabled ? 0.6 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      accessibilityLabel={label}
    >
      <View style={[styles.row, { columnGap: token.gap }]}>
        {renderIcon(iconSpec, token.icon)}
        <Text style={[styles.text, { color: selText, fontSize: token.text }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  pill: {
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontWeight: "500",
  },
});

export default CategoryPill;
