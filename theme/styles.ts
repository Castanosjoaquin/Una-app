// theme/styles.ts
import { StyleSheet, Platform } from "react-native";
import { Tokens } from "./tokens";

export const makeCard = (t: Tokens) => StyleSheet.create({
  base: {
    backgroundColor: t.semantic.card,
    borderRadius: t.radii.lg,
    padding: t.spacing.lg,
    borderWidth: 1,
    borderColor: t.semantic.border,
    ...t.shadows.card,
  },
});

export const makeText = (t: Tokens) => ({
  h1: { fontSize: t.typography.fontSize["3xl"], color: t.semantic.foreground, fontWeight:"800" },
  h2: { fontSize: t.typography.fontSize["2xl"], color: t.semantic.foreground, fontWeight:"800" },
  title: { fontSize: t.typography.fontSize.xl, color: t.semantic.foreground, fontWeight:"700" },
  body: { fontSize: t.typography.fontSize.base, color: t.semantic.foreground },
  caption: { fontSize: t.typography.fontSize.caption, color: t.semantic.mutedForeground },
});

export const makeButton = (t: Tokens) => StyleSheet.create({
  solid: {
    minHeight: t.touch.md, paddingHorizontal: t.spacing.lg, borderRadius: t.radii.md,
    backgroundColor: t.palette.brand, alignItems: "center", justifyContent: "center",
    ...t.shadows.button,
  },
  solidText: { color: "#fff", fontWeight: "800" },
  outline: {
    minHeight: t.touch.md, paddingHorizontal: t.spacing.lg, borderRadius: t.radii.md,
    borderWidth: 1, borderColor: t.semantic.ring, backgroundColor: "transparent",
    alignItems:"center", justifyContent:"center",
  },
  outlineText: { color: t.semantic.foreground, fontWeight:"800" },
});

export const makePill = (t: Tokens) => StyleSheet.create({
  base: {
    height: t.touch.sm, paddingHorizontal: t.spacing.md, borderRadius: t.touch.sm/2,
    backgroundColor: t.palette.destructive, flexDirection:"row", alignItems:"center", columnGap: 6,
  },
  text: { color:"#fff", fontWeight:"700" },
});

export const makeIconCircle = (t: Tokens) => StyleSheet.create({
  base: {
    width: t.touch.sm, height: t.touch.sm, borderRadius: t.touch.sm/2,
    backgroundColor: t.semantic.muted, alignItems: "center", justifyContent: "center",
  },
});
