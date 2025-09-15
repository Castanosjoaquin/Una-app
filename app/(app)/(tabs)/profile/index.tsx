import {Alert, SafeAreaView,View, Text, TouchableOpacity,StyleSheet,Pressable  } from 'react-native';
import React from 'react';
import { useTheme } from '@/app/../theme/theme';
import { Ionicons } from '@expo/vector-icons'; 
import EventsSection from '@/app/components/EventsSection';
import { MOCK_EVENTS } from '@/app/components/MockEvents';
import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import ProfileImageModal from '@/app/components/ProfileImageModal';
import AvatarInteractive from '@/app/components/AvatarInteractive';
import { supabase } from '@/app/src/lib/supabase';

export default function ProfilePage() {
  const router = useRouter();
  const { colors, radii, space, typography } = useTheme();
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
      <View style={[{ flex: 1, backgroundColor: colors.background, padding: space[4], alignItems: "center", justifyContent: "center" }]}> 
        <Text style={{ color: colors.foreground }}>Cargando perfil...</Text>
      </View>
    );
  }
 
  return (

    <View style={{ flex: 1, backgroundColor: colors.background, padding: space[4] }}>
      <View style={{
        backgroundColor: colors.card.DEFAULT,
        borderRadius: radii.lg,
        padding: space[4],
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
      }}>
        {/* Header: avatar + username */}
  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: space[4] }}>
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
          <View style={{ flex: 1, marginLeft: space[3] }}>
            <Text style={{ fontSize: typography.sizes.title, fontWeight: "700", color: colors.primary.DEFAULT }}>{username}</Text>
            <View style={{ height: space[2] }} />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="location-outline" size={16} color={colors.primary[300]} style={{ marginRight: 4 }} />
                <Text style={{ color: colors.primary[300], marginTop: 2 }}>{location}</Text>
            </View>
          </View>

          {/* Botón ruedita → settings */}
          <Pressable style={{
            width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center",
            backgroundColor: colors.primary[100], marginRight: 8,
          }} onPress={() => router.push("../profile/settings")}> 
            <Ionicons name="settings-outline" size={20} color={colors.primary.DEFAULT} />
          </Pressable>

          {/* Botón Edit → edit profile */}
          <Pressable style={{
            paddingHorizontal: 12, height: 36, borderRadius: 18,
            alignItems: "center", justifyContent: "center", backgroundColor: colors.primary.DEFAULT,
          }} onPress={() => router.push("../profile/edit")}> 
            <Text style={{ color: "#fff", fontWeight: "700" }}>Edit</Text>
          </Pressable>
        </View>

        {/* Body */}
        <View style={{ marginTop: space[4] }}>
          <Text style={{ fontWeight: "800", fontSize: typography.sizes.heading, color: colors.foreground, marginBottom: 6 }}>Description</Text>
          <Text style={{ color: colors.muted.foreground }}>{description}</Text>

          <View style={{ flexDirection: "row", alignItems: "center", marginTop: space[2] }}>
            <Ionicons name="logo-instagram" size={16} color={colors.accent.foreground} />
            <Text style={{ color: colors.muted.foreground, marginLeft: 8 }}>{instagram}</Text>
          </View>
        </View>
      </View>

      {/* Resto del perfil: listas, tabs internas, etc. */}
  <View style={{ marginTop: space[3] }}>
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
          style={{
            backgroundColor: colors.destructive.DEFAULT,
            borderRadius: radii.lg,
            paddingVertical: space[4],
            marginBottom: space[5],
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 1 },
            shadowRadius: 2,
          }}
          activeOpacity={0.8}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="log-out-outline" size={20} color={colors.card.DEFAULT} />
            <Text style={{ color: colors.card.DEFAULT, fontWeight: "600", fontSize: 16, marginLeft: 8 }}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
  </View>

  );
} 


