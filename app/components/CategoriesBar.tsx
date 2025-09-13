// CategoriesBar.tsx
import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import CategoryPill from "./CategoryPill";

const CATEGORIES = ["All","Chill","Go Out","Romantic","Active","Creative","Wellness","Sightseeing","Social"];

export default function CategoriesBar() {
  const [selected, setSelected] = React.useState("All");

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {CATEGORIES.map((c) => (
          <View key={c} style={styles.item}>
            <CategoryPill
              label={c}
              selected={selected === c}
              onPress={() => setSelected(c)}
              size="md"
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 8 },
  row: { paddingHorizontal: 8 },
  item: { marginRight: 8 },
});
