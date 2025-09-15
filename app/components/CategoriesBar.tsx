// CategoriesBar.tsx
import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import CategoryPill from "./CategoryPill";
import { useTheme } from "@/app/../theme/theme";

const CATEGORIES = ["all", "chill", "go out", "romantic", "active", "creative", "wellness", "sightseeing", "social"];

export default function CategoriesBar() {
  const { colors, space, radii } = useTheme();
  const [selected, setSelected] = React.useState("all");
  return (

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ columnGap: space[2], paddingVertical: 4 }}

      >
        {CATEGORIES.map((c) => (
          <CategoryPill
            key={c}
            label={c}
            selected={selected === c}
            onPress={() => setSelected(c)}
            size="md"
        />
      ))}
    </ScrollView>

);
}