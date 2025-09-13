import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LocationPill({
  label = "Palermo",
  onPress,
}: {
  label?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.pill}>
      <Ionicons name="location-sharp" size={16} color="#fff" />
      <Text style={styles.text} numberOfLines={1}>{label}</Text>
      <Ionicons name="chevron-down" size={16} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF4444",
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 16,
    columnGap: 6,
  },
  text: { color: "#fff", fontWeight: "700" },
});
