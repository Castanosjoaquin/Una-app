import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, Switch, Alert, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/app/src/lib/supabase"; // ← tu cliente inicializado

import { useTheme } from "@/app/../theme/theme";

type Profile = {
  id: string;
  username: string | null;
  bio: string | null;
  social_url: string | null;
  neighborhood: string | null;
  avatar_path: string | null;
  private_profile: boolean | null;
  show_in_search: boolean | null;
  specialties: string[] | null;
};

const AVATAR_BUCKET = "avatars";

export default function EditProfileScreen() {
  const theme = useTheme();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    })();
  }, []);

  // form state
  const [username, setUsername] = useState("");
  const [socialUrl, setSocialUrl] = useState("");
  const [bio, setBio] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [showInSearch, setShowInSearch] = useState(true);

  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const avatarUrl = useMemo(() => {
    if (!avatarPath) return undefined;
    const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(avatarPath);
    return data.publicUrl;
  }, [avatarPath]);

  useEffect(() => {
    (async () => {
      try {
        if (!userId) return;
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single<Profile>();
        if (error && error.code !== "PGRST116") throw error; // not found is ok

        if (data) {
          setUsername(data.username ?? "");
          setSocialUrl(data.social_url ?? "");
          setBio(data.bio ?? "");
          setNeighborhood(data.neighborhood ?? "");
          setAvatarPath(data.avatar_path ?? null);
          setPrivateProfile(Boolean(data.private_profile));
          setShowInSearch(data.show_in_search ?? true);
          setSpecialties(data.specialties ?? []);
        }
      } catch (e: any) {
        console.error(e);
        Alert.alert("Error", e.message ?? "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const pickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission required", "We need gallery access to change your photo.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (res.canceled) return;

    const file = res.assets[0];
    // Upload
    try {
      setSaving(true);
      const ext = file.fileName?.split(".").pop() || "jpg";
      const path = `${userId}/${Date.now()}.${ext}`;

      const { error: upErr } = await supabase
        .storage
        .from(AVATAR_BUCKET)
        .upload(path, {
          // @ts-ignore expo-image-picker returns uri
          uri: file.uri,
          name: file.fileName ?? `avatar.${ext}`,
          type: file.mimeType ?? "image/jpeg",
        }, { upsert: true });

      if (upErr) throw upErr;

      setAvatarPath(path);
    } catch (e: any) {
      console.error(e);
      Alert.alert("Upload failed", e.message ?? "Could not upload avatar");
    } finally {
      setSaving(false);
    }
  };

  const addSpecialty = (tag: string) => {
    const clean = tag.trim();
    if (!clean) return;
    if (specialties.includes(clean)) return;
    setSpecialties(prev => [...prev, clean]);
  };

  const removeSpecialty = (tag: string) => {
    setSpecialties(prev => prev.filter(t => t !== tag));
  };

  const onSave = async () => {
    if (!userId) return;
    // Validaciones sencillas
    if (!username.trim()) {
      Alert.alert("Username required", "Please enter your username.");
      return;
    }
    if (socialUrl && !/^https?:\/\/.+/i.test(socialUrl)) {
      Alert.alert("Invalid URL", "Social page must start with http:// or https://");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        id: userId,
        username: username.trim(),
        bio: bio.trim() || null,
        social_url: socialUrl.trim() || null,
        neighborhood: neighborhood.trim() || null,
        avatar_path: avatarPath,
        private_profile: privateProfile,
        show_in_search: showInSearch,
        specialties,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });
      if (error) throw error;

      Alert.alert("Saved", "Your changes were saved successfully.");
    } catch (e: any) {
      console.error(e);
      Alert.alert("Save failed", e.message ?? "Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background, padding: theme.space[4] }}
      contentContainerStyle={{ paddingBottom: theme.space[10] }}
    >
      {/* Avatar + camera button */}
      <View style={{ alignItems: "center", marginTop: theme.space[2], marginBottom: theme.space[5] }}>
        <View style={{ position: "relative", width: 96, height: 96 }}>
          <Image
            source={avatarUrl || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"}
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: theme.colors.background,
              borderWidth: 2,
              borderColor: theme.colors.border,
            }}
            contentFit="cover"
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: theme.colors.background,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: theme.colors.border,
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 2,
            }}
            onPress={pickAvatar}
          >
            <Ionicons name="camera" size={18} color={theme.colors.primary.DEFAULT} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Name */}
  <Text style={{ marginTop: theme.space[2], marginBottom: theme.space[1], fontWeight: "700", color: theme.colors.primary[900] }}>{"Username"}</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Your username"
        style={{
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: theme.colors.primary[200],
          paddingHorizontal: theme.space[3],
          paddingVertical: theme.space[3],
          borderRadius: theme.radii.lg,
          fontSize: 15,
        }}
      />

      {/* Social */}
  <Text style={{ marginTop: theme.space[2], marginBottom: theme.space[1], fontWeight: "700", color: theme.colors.primary[900] }}>{"Social Page"}</Text>
      <TextInput
        value={socialUrl}
        onChangeText={setSocialUrl}
        placeholder="https://instagram.com/username"
        autoCapitalize="none"
        autoCorrect={false}
        style={{
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: theme.colors.primary[200],
          paddingHorizontal: theme.space[3],
          paddingVertical: theme.space[3],
          borderRadius: theme.radii.lg,
          fontSize: 15,
        }}
      />

      {/* Bio */}
  <Text style={{ marginTop: theme.space[2], marginBottom: theme.space[1], fontWeight: "700", color: theme.colors.primary[900] }}>{"Bio"}</Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        placeholder="Tell us a little about yourself..."
        multiline
        textAlignVertical="top"
        numberOfLines={5}
        style={{
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: theme.colors.primary[200],
          paddingHorizontal: theme.space[3],
          paddingVertical: theme.space[3],
          borderRadius: theme.radii.lg,
          fontSize: 15,
          height: 120,
        }}
      />

      {/* Neighborhood */}
  <Text style={{ marginTop: theme.space[2], marginBottom: theme.space[1], fontWeight: "700", color: theme.colors.primary[900] }}>{"Neighborhood"}</Text>
      <TextInput
        value={neighborhood}
        onChangeText={setNeighborhood}
        placeholder="e.g. Palermo, Buenos Aires"
        style={{
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: theme.colors.primary[200],
          paddingHorizontal: theme.space[3],
          paddingVertical: theme.space[3],
          borderRadius: theme.radii.lg,
          fontSize: 15,
        }}
      />

      {/* Specialties */}
  <Text style={{ marginTop: theme.space[2], marginBottom: theme.space[1], fontWeight: "700", color: theme.colors.primary[900] }}>{"Specialties"}</Text>
      <TagInput
        values={specialties}
        onAdd={addSpecialty}
        onRemove={removeSpecialty}
        theme={theme}
      />

      {/* Privacy Settings */}
  <Text style={{ fontWeight: "800", fontSize: 16, color: theme.colors.foreground, marginBottom: theme.space[2], marginTop: theme.space[4] }}>{"Privacy Settings"}</Text>

      <RowSwitch
        label="Private Profile"
        value={privateProfile}
        onValueChange={setPrivateProfile}
        theme={theme}
      />
      <RowSwitch
        label="Show in Search"
        value={showInSearch}
        onValueChange={setShowInSearch}
        theme={theme}
      />

      {/* Save */}
      <TouchableOpacity
        style={{
          marginTop: theme.space[5],
          backgroundColor: theme.colors.primary.DEFAULT,
          borderRadius: theme.radii.lg,
          paddingVertical: theme.space[4],
          alignItems: "center",
          opacity: saving ? 0.7 : 1,
        }}
        onPress={onSave}
        disabled={saving}
        activeOpacity={0.8}
      >
        {saving ? <ActivityIndicator color={theme.colors.primary.foreground} /> : <Text style={{ color: theme.colors.primary.foreground, fontWeight: "800" }}>Save Changes</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

// ------- Helpers UI -------

function RowSwitch({ label, value, onValueChange, theme }: { label: string; value: boolean; onValueChange: (v: boolean) => void; theme: any }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: theme.space[2] }}>
      <Text style={{ color: theme.colors.foreground, fontSize: 15 }}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

function TagInput({ values, onAdd, onRemove, theme }: { values: string[]; onAdd: (t: string) => void; onRemove: (t: string) => void; theme: any }) {
  const [text, setText] = useState("");
  return (
    <View style={{ marginBottom: theme.space[2] }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.space[2], marginBottom: theme.space[2] }}>
        {values.map((t) => (
          <View key={t} style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: theme.space[2],
            paddingVertical: theme.space[1],
            backgroundColor: theme.colors.neutral[100],
            borderRadius: 999,
          }}>
            <Text style={{ fontSize: 12, color: theme.colors.foreground, fontWeight: "600" }}>{t}</Text>
            <TouchableOpacity onPress={() => onRemove(t)} style={{ marginLeft: theme.space[1] }}>
              <Ionicons name="close" size={12} color={theme.colors.neutral[400]} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: "row", columnGap: theme.space[2] }}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Add specialty"
          style={{
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: theme.colors.primary[200],
            paddingHorizontal: theme.space[3],
            paddingVertical: theme.space[3],
            borderRadius: theme.radii.lg,
            fontSize: 15,
            flex: 1,
          }}
          onSubmitEditing={() => {
            onAdd(text);
            setText("");
          }}
        />
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: theme.space[3],
            paddingVertical: theme.space[2],
            borderRadius: theme.radii.md,
            borderWidth: 1,
            borderColor: theme.colors.primary[200],
            backgroundColor: theme.colors.background,
          }}
          onPress={() => { onAdd(text); setText(""); }}
        >
          <Ionicons name="add" size={18} color={theme.colors.primary.DEFAULT} />
          <Text style={{ color: theme.colors.primary.DEFAULT, fontWeight: "700", marginLeft: theme.space[1] }}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles removed: all styles are now inline and use theme tokens