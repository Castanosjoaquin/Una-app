import { View, Text, Switch, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React,{ useState } from "react";

export default function SettingsScreen() {
  const [push, setPush] = useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.item}>
        <Text style={styles.label}>Push notifications</Text>
        <Switch value={push} onValueChange={setPush} />
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>Language</Text>
        <Text style={styles.value}>English</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, padding: 16, backgroundColor: "#fff" },
  item: { paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: "#eee",
          flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  label: { fontSize: 16 },
  value: { color: "#666" },
});