// CategoryPill.tsx
import React, { memo } from "react";
import { Text, View, TouchableOpacity, StyleSheet, GestureResponderEvent } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// Align import path with other components (may vary by project)
import { useTheme } from '@/app/../theme/theme';

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

// Define icons per category; colours will be assigned dynamically from tokens.
const PRESETS: Record<string, PillPreset> = {
  "all":         { icon: { pack: "ion", name: "ellipse-outline", color: "" } },
  "chill":       { icon: { pack: "ion", name: "cafe-outline",     color: "" } },
  "go out":      { icon: { pack: "ion", name: "flash-outline",    color: "" } },
  "romantic":    { icon: { pack: "ion", name: "heart-outline",    color: "" } },
  "active":      { icon: { pack: "ion", name: "bicycle-outline",  color: "" } },
  "creative":    { icon: { pack: "mci", name: "palette-outline",  color: "" } },
  "wellness":    { icon: { pack: "ion", name: "leaf-outline",     color: "" } },
  "sightseeing": { icon: { pack: "ion", name: "camera-outline",   color: "" } },
  "social":      { icon: { pack: "ion", name: "people-outline",   color: "" } },
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

  const { colors } = useTheme();
  const key = label.trim().toLowerCase();
  const preset = PRESETS[key];

  // Helper to lighten an HSL string. Clamps lightness to a maximum of 95%.
  const lightenHsl = (hsl: string, amount: number) => {
    const match = /hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/.exec(hsl);
    if (!match) return hsl;
    const h = parseInt(match[1], 10);
    const s = parseInt(match[2], 10);
    const l = parseInt(match[3], 10);
    const newL = Math.min(95, l + amount);
    return `hsl(${h} ${s}% ${newL}%)`;
  };

  // Choose a colour group from the theme based on the category.
  const group = (() => {
    switch (key) {
      case 'chill':
        return colors.primary;
      case 'go out':
        return colors.warning;
      case 'romantic':
        return colors.coral;
      case 'active':
        return colors.success;
      case 'creative':
        return colors.tertiary;
      case 'wellness':
        return colors.success;
      case 'sightseeing':
        return colors.secondary;
      case 'social':
        return colors.warning;
      case 'all':
        return colors.accent;
      default:
        return colors.accent;
    }
  })();
  // Determine a base pastel colour; prefer defined scales if available, otherwise lighten the default.
  const baseColour: string =
    (group && typeof group === 'object' && '300' in group
      ? (group as any)['300']
      : typeof group === 'object' && '200' in group
      ? (group as any)['200']
      : typeof group === 'object' && '100' in group
      ? (group as any)['100']
      : group?.DEFAULT) || 'hsl(0 0% 90%)';
  const saturatedColour: string = group?.DEFAULT || baseColour;
  // Create pastel variations for the unselected state.
  const pastelBg = bgColor ?? lightenHsl(baseColour, 20);
  const pastelBorder = borderColor ?? lightenHsl(baseColour, 10);
  const pastelText = textColor ?? saturatedColour;

  const token = sizeTokens[size];
  const iconSpec: IconSpec = iconOverride ?? preset?.icon ?? { pack: 'ion', name: 'pricetag-outline', color: '' };
  const finalIcon: IconSpec = { ...iconSpec, color: saturatedColour };


  // Fondo: background general, pero si está seleccionado, color de la categoría
  const selBg = selected ? saturatedColour : colors.background;
  // Sombra del token
  const { shadows } = useTheme();
  const pillShadow = shadows.card;
  // Color de texto e icono: blanco si está seleccionado, si no el color de la categoría
  const selText = selected ? '#fff' : saturatedColour;
  // Color de fondo al presionar
  const pressBg = saturatedColour;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.pill,
        {
          paddingHorizontal: token.padH,
          paddingVertical: token.padV,
          borderRadius: rounded ?? 999,
          backgroundColor: selBg,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 4,
          // Web shadow fallback
          boxShadow: pillShadow,
          opacity: disabled ? 0.6 : 1,
          borderWidth: 0,
        },
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      accessibilityLabel={label}
      // Cambia el fondo al presionar
      onPressIn={e => {
        e.currentTarget.setNativeProps({ style: { backgroundColor: pressBg } });
      }}
      onPressOut={e => {
        e.currentTarget.setNativeProps({ style: { backgroundColor: selBg } });
      }}
    >
      <View style={[styles.row, { columnGap: token.gap }]}
      >
        {renderIcon({ ...finalIcon, color: selText }, token.icon)}
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
