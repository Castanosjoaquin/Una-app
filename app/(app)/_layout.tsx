
import React from "react";
import { Stack } from "expo-router";
import { SafeAreaView, ActivityIndicator } from "react-native";
import { useAuth } from "../hooks/useAuth";

export default function AuthLayout() {
    const { ready, logged } = useAuth();

    if (!ready) {
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    return (
        <Stack>
            <Stack.Protected guard={logged}>
                {/* Pantallas protegidas para usuarios autenticados */}
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerTitle: 'Una',
                        headerStyle: { backgroundColor: '#f5f5f5' },
                        headerTitleStyle: { color: '#333', fontWeight: '900', fontFamily: 'Nunito Sans' },
                        headerTintColor: '#007AFF',
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
