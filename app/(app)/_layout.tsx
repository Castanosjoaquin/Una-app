
import React from "react";
import { Stack } from "expo-router";
import { View, ActivityIndicator,Text } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";
import LocationPill from "@/app/components/LocationPill";
import IconCircle from "@/app/components/IconCircle";

export default function AuthLayout() {
    const { ready, logged } = useAuth();

    if (!ready) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <Stack>
            <Stack.Protected guard={logged}>
                {/* Pantallas protegidas para usuarios autenticados */}
        <Stack.Screen
          name="(tabs)"
          options={{
            // estilos generales del header
            headerShadowVisible: true,
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#fff" },

            // LOGO a la izquierda
            headerLeft: () => (
              <View style={{ flexDirection: "row", alignItems: "center", paddingLeft: 8 }}>
                <Text style={{ fontSize: 20, fontWeight: "900", color: "#F97316" }}>una</Text>
                <MaterialIcons name="auto-awesome" size={16} color="#FB923C" style={{ marginLeft: 4 }} />
              </View>
            ),

            // PILL de ubicación al centro (título)
            headerTitle: () => (
              <LocationPill
                label="Palermo"
                onPress={() => console.log("cambiar barrio")}
              />
            ),

            // Botones a la derecha
            headerRight: () => (
              <View style={{ flexDirection: "row", paddingRight: 8 }}>
                <IconCircle onPress={() => console.log("buscar")}>
                  <Ionicons name="search" size={18} color="#111827" />
                </IconCircle>
                <IconCircle onPress={() => console.log("notificaciones")}>
                  <Ionicons name="notifications-outline" size={18} color="#111827" />
                </IconCircle>
              </View>
            ),
          }}
        />
            </Stack.Protected>

            <Stack.Protected guard={!logged}>
                {/* Pantallas públicas o de login */}
                <Stack.Screen name="sign-in" options={{ headerShown: false }} />
                <Stack.Screen name="sign-up" options={{ headerShown: false }} />
            </Stack.Protected>
        </Stack>
    );
}
