import {Alert, SafeAreaView,View, Text, TouchableOpacity,StyleSheet,Pressable  } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons'; 
import EventsSection from '@/app/components/EventsSection';
import { MOCK_EVENTS } from '@/app/components/MockEvents';
import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import ProfileImageModal from '@/app/components/ProfileImageModal';
import AvatarInteractive from '@/app/components/AvatarInteractive';
import { supabase } from '@/lib/supabase';


export default function ProfilePage() {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("All");
  const [modalVisible, setModalVisible] = useState(false);

  const eventsForFilter = useMemo(
      () => MOCK_EVENTS.filter(e => filter === "All" || e.tags?.includes(filter)),
      [filter]
  );
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("username, neighborhood, bio, social_url, avatar_path")
        .eq("id", user.id)
        .single();
      setProfile(data || null);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const username = profile?.username || "No username";
  const location = profile?.neighborhood || "Not specified";
  const description = profile?.bio || "No description";
  const instagram = profile?.social_url || "No Instagram";
  const profileImageUrl = profile?.avatar_path
    ? supabase.storage.from("avatars").getPublicUrl(profile.avatar_path).data.publicUrl
    : "https://i.pravatar.cc/300";

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress:() => supabase.auth.signOut(),
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.safe, { alignItems: "center", justifyContent: "center" }]}> 
        <Text>Cargando perfil...</Text>
      </View>
    );
  }
 
  return (

    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        {/* Header: avatar + username */}
        <View style={styles.header}>
          <AvatarInteractive
            imageUrl={profileImageUrl}
            size={72}
            onTapUpload={() => {
              // a) ir a una tab/página para subir story:
              router.push("/(app)/(tabs)/profile/stories");  // o la ruta que uses
            // b) o abrir un image picker aquí
          }}
          onLongPreview={() => setModalVisible(true)}
          showPlus
        />

        {/* Modal de preview con fondo difuminado */}
        <ProfileImageModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          imageUrl={profileImageUrl}
          imageSize={300}
          blurAmount={60}
        />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.username}>{username}</Text>
            <View style={{ height: 8 }} />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="location-outline" size={16} color="#A78BFA" style={{ marginRight: 4 }} />
                <Text style={styles.sub}>{location}</Text>
            </View>
          </View>

          {/* Botón ruedita → settings */}
          <Pressable style={styles.iconBtn} onPress={() => router.push("../profile/settings")}>
            <Ionicons name="settings-outline" size={20} />
          </Pressable>

          {/* Botón Edit → edit profile */}
          <Pressable style={styles.editBtn} onPress={() => router.push("../profile/edit")}>
            <Text style={styles.editTxt}>Edit</Text>
          </Pressable>
        </View>

        {/* Body */}
        <View style={styles.body}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.textMuted}>{description}</Text>

          <View style={styles.row}>
            <Ionicons name="logo-instagram" size={16} />
            <Text style={[styles.textMuted, { marginLeft: 8 }]}>{instagram}</Text>
          </View>
        </View>
      </View>

      {/* Resto del perfil: listas, tabs internas, etc. */}
      <View style={styles.block}>
        <EventsSection
          title="Tus eventos"
          filters={["All", "Friends"]}
          selectedFilter={filter}
          onChangeFilter={setFilter}
          data={eventsForFilter}
          onPressEvent={(e) => console.log("open event", e.title)}
          onToggleLike={(id, liked) => console.log("like", id, liked)}
          onPressAdd={() => console.log("add event")}
        />
      </View>
      

  
      {/* Sign Out  */}
      <View style={{ flex: 1, justifyContent: "flex-end"}}>
        <TouchableOpacity
          onPress={handleSignOut}
          style={styles.signOutButton}
          activeOpacity={0.8}
        >
          <View style={styles.signOutContent}>
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
  </SafeAreaView>

  );
}


const styles = StyleSheet.create({
  signOutButton: {
    backgroundColor: "#DC2626", // bg-red-600
    borderRadius: 12,           // rounded-xl
    paddingVertical: 16,        // py-4
    marginBottom: 24,           // mb-6
    shadowColor: "#000",
    shadowOpacity: 0.1,         // shadow-sm
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  signOutContent: {
    flexDirection: "row",       // flex-row
    alignItems: "center",       // items-center
    justifyContent: "center",   // justify-center
  },
  signOutText: {
    color: "white",             // text-white
    fontWeight: "600",          // font-semibold
    fontSize: 16,               // text-base
    marginLeft: 8,              // ml-2
  },

  safe: { flex: 1, backgroundColor: "#FFF7ED", padding: 16 }, // igual que edit
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 12, backgroundColor: "#eee" },
  username: { fontSize: 18, fontWeight: "700", color: "#6D28D9" },
  sub: { color: "#A78BFA", marginTop: 2 },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center",
    backgroundColor: "#E9D5FF", marginRight: 8,
  },
  editBtn: {
    paddingHorizontal: 12, height: 36, borderRadius: 18,
    alignItems: "center", justifyContent: "center", backgroundColor: "#6D28D9",
  },
  editTxt: { color: "#fff", fontWeight: "700" },
  body: { marginTop: 16 },
  sectionTitle: { fontWeight: "800", fontSize: 16, color: "#111827", marginBottom: 6 },
  textMuted: { color: "#6B7280" },
  row: { flexDirection: "row", alignItems: "center", marginTop: 8 },
    
  block: { marginTop: 12 },
});