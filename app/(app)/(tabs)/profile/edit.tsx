import React, { useEffect, useMemo, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  Switch, Alert, ActivityIndicator
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/app/src/lib/supabase"; // ← tu cliente inicializado

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
      <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Avatar + camera button */}
      <View style={styles.avatarWrap}>
        <Image
          source={avatarUrl || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"}
          style={styles.avatar}
          contentFit="cover"
        />
        <TouchableOpacity style={styles.camBtn} onPress={pickAvatar}>
          <Ionicons name="camera" size={16} color="#7C3AED" />
        </TouchableOpacity>
      </View>

      {/* Name */}
      <Text style={styles.label}>Username</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Your username"
        style={styles.input}
      />

      {/* Social */}
      <Text style={styles.label}>Social Page</Text>
      <TextInput
        value={socialUrl}
        onChangeText={setSocialUrl}
        placeholder="https://instagram.com/username"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />

      {/* Bio */}
      <Text style={styles.label}>Bio</Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        placeholder="Tell us a little about yourself..."
        multiline
        textAlignVertical="top"
        numberOfLines={5}
        style={[styles.input, { height: 120 }]}
      />

      {/* Neighborhood */}
      <Text style={styles.label}>Neighborhood</Text>
      <TextInput
        value={neighborhood}
        onChangeText={setNeighborhood}
        placeholder="e.g. Palermo, Buenos Aires"
        style={styles.input}
      />

      {/* Specialties */}
      <Text style={styles.label}>Specialties</Text>
      <TagInput
        values={specialties}
        onAdd={addSpecialty}
        onRemove={removeSpecialty}
      />

      {/* Privacy Settings */}
      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Privacy Settings</Text>

      <RowSwitch
        label="Private Profile"
        value={privateProfile}
        onValueChange={setPrivateProfile}
      />
      <RowSwitch
        label="Show in Search"
        value={showInSearch}
        onValueChange={setShowInSearch}
      />

      {/* Save */}
      <TouchableOpacity
        style={[styles.saveBtn, saving && { opacity: 0.7 }]}
        onPress={onSave}
        disabled={saving}
        activeOpacity={0.8}
      >
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveTxt}>Save Changes</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ------- Helpers UI ------- */

function RowSwitch({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (v: boolean) => void }) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

function TagInput({
  values, onAdd, onRemove,
}: { values: string[]; onAdd: (t: string) => void; onRemove: (t: string) => void }) {
  const [text, setText] = useState("");
  return (
    <View style={{ marginBottom: 8 }}>
      <View style={chipStyles.wrap}>
        {values.map((t) => (
          <View key={t} style={chipStyles.chip}>
            <Text style={chipStyles.chipTxt}>{t}</Text>
            <TouchableOpacity onPress={() => onRemove(t)} style={chipStyles.xBtn}>
              <Ionicons name="close" size={12} color="#6B7280" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: "row", columnGap: 8 }}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Add specialty"
          style={[styles.input, { flex: 1 }]}
          onSubmitEditing={() => {
            onAdd(text);
            setText("");
          }}
        />
        <TouchableOpacity style={chipStyles.addBtn} onPress={() => { onAdd(text); setText(""); }}>
          <Ionicons name="add" size={18} color="#7C3AED" />
          <Text style={{ color: "#7C3AED", fontWeight: "700", marginLeft: 4 }}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ------- Styles ------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF7ED", padding: 16 }, // fondo cálido
  avatarWrap: { alignItems: "center", marginTop: 8, marginBottom: 20 },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#eee" },
  camBtn: {
    position: "absolute", right: -16, bottom: -4, // 96/6 = 16
    width: 28, height: 28, borderRadius: 14, backgroundColor: "#fff",
    alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#E5E7EB",
  },
  label: { marginTop: 8, marginBottom: 6, fontWeight: "700", color: "#6D28D9" },
  input: {
    backgroundColor: "white", borderWidth: 1, borderColor: "#E9D5FF",
    paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, fontSize: 15,
  },
  sectionTitle: { fontWeight: "800", fontSize: 16, color: "#111827", marginBottom: 8 },
  saveBtn: {
    marginTop: 20, backgroundColor: "#6D28D9", borderRadius: 14,
    paddingVertical: 14, alignItems: "center",
  },
  saveTxt: { color: "white", fontWeight: "800" },
});

const rowStyles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 },
  label: { color: "#111827", fontSize: 15 },
});

const chipStyles = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
  },
  chipTxt: { fontSize: 12, color: "#111827", fontWeight: "600" },
  xBtn: { marginLeft: 6 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E9D5FF",
    backgroundColor: "#FFFFFF",
  },
});