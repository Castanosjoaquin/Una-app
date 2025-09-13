// mockEvents.ts
import { EventItem } from "./EventCard";

export const MOCK_EVENTS: EventItem[] = [
  {
    id: "1",
    title: "Painting at my place",
    neighborhood: "Palermo Soho",
    city: "Buenos Aires",
    dateLabel: "Date TBD",
    priceLabel: "$10",
    imageUrl: "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e5?q=80&w=1200",
    tags: ["All"],
  },
  {
    id: "2",
    title: "Picnic in boco park",
    neighborhood: "Boca",
    city: "Buenos Aires",
    dateLabel: "Aug 29",
    priceLabel: "$30",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200",
    tags: ["All", "Friends"],
  },
  {
    id: "3",
    title: "Going to art market",
    neighborhood: "Palermo",
    dateLabel: "Aug 24",
    priceLabel: "Free",
    imageUrl: "https://images.unsplash.com/photo-1520975661595-6453be3f7070?q=80&w=1200",
    tags: ["All"],
  },
  {
    id: "4",
    title: "Pre Drinks",
    dateLabel: "Aug 24",
    priceLabel: "$40",
    imageUrl: "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200",
    tags: ["Friends"],
  },
];
