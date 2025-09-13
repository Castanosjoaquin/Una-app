import React, { memo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

export type EventItem = {
  id: string;
  title: string;
  neighborhood?: string;      // ej. Palermo
  city?: string;              // ej. Buenos Aires
  dateLabel?: string;         // ej. Aug 24 o "Date TBD"
  priceLabel?: string;        // ej. $30 / $40 / Free
  imageUrl: string;
  liked?: boolean;
  tags?: string[];            // filtros a los que pertenece (para el chip arriba de la foto)
};

type Props = {
  item: EventItem;
  onPress?: (item: EventItem) => void;
  onToggleLike?: (id: string, liked: boolean) => void;
  width?: number;
  height?: number;
  radius?: number;
};

const EventCard = memo(({ item, onPress, onToggleLike, width = 260, height = 190, radius = 16 }: Props) => {
  const [liked, setLiked] = useState(!!item.liked);

  const toggle = () => {
    const next = !liked;
    setLiked(next);
    onToggleLike?.(item.id, next);
  };

  const location =
    item.neighborhood && item.city
      ? `${item.neighborhood}, ${item.city}`
      : item.neighborhood || item.city || "";

  return (
    <TouchableOpacity style={[styles.container, { width }]} activeOpacity={0.8} onPress={() => onPress?.(item)}>
      <View style={[styles.imageWrap, { height, borderRadius: radius }]}>
        <Image
          source={item.imageUrl}
          style={{ flex: 1, borderRadius: radius }}
          contentFit="cover"
          transition={150}
          cachePolicy="memory-disk"
        />

        {/* chips de tags en la esquina superior izquierda */}
        <View style={styles.tagsRow}>
          {item.tags?.slice(0, 2).map((t) => (
            <View key={t} style={styles.tagPill}>
              <Text style={styles.tagText}>{t}</Text>
            </View>
          ))}
        </View>

        {/* botón like */}
        <TouchableOpacity onPress={toggle} style={styles.likeBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <View style={styles.likeBg}>
            <Ionicons name={liked ? "heart" : "heart-outline"} size={18} color={liked ? "#ef4444" : "#111827"} />
          </View>
        </TouchableOpacity>

        {/* overlay inferior con títulos y chips de fecha/precio */}
        <View style={styles.bottomGradient} />
        <View style={styles.bottomContent}>
          <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
          {!!location && <Text numberOfLines={1} style={styles.location}>{location}</Text>}

          <View style={styles.metaRow}>
            {!!item.dateLabel && (
              <View style={styles.metaPill}>
                <Text style={styles.metaText}>{item.dateLabel}</Text>
              </View>
            )}
            {!!item.priceLabel && (
              <View style={[styles.metaPill, { backgroundColor: "#111827" }]}>
                <Text style={[styles.metaText, { color: "white" }]}>{item.priceLabel}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: { marginRight: 16 },
  imageWrap: { overflow: "hidden" },
  tagsRow: { position: "absolute", top: 8, left: 8, flexDirection: "row", columnGap: 6 },
  tagPill: { backgroundColor: "rgba(255,255,255,0.9)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  tagText: { fontSize: 11, color: "#111827", fontWeight: "600" },

  likeBtn: { position: "absolute", top: 8, right: 8 },
  likeBg: { width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.9)", alignItems: "center", justifyContent: "center" },

  bottomGradient: { position: "absolute", left: 0, right: 0, bottom: 0, height: 80, backgroundColor: "rgba(0,0,0,0.25)" },
  bottomContent: { position: "absolute", left: 10, right: 10, bottom: 10 },
  title: { color: "white", fontSize: 16, fontWeight: "700" },
  location: { color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 2 },
  metaRow: { flexDirection: "row", columnGap: 8, marginTop: 8 },
  metaPill: { backgroundColor: "rgba(255,255,255,0.95)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  metaText: { fontSize: 12, color: "#111827", fontWeight: "700" },
});

export default EventCard;
