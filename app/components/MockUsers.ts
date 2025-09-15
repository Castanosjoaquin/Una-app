// mockUsers.ts
import { StoryUser } from "./StoryItem";

export const MOCK_USERS: StoryUser[] = [
  {
    id: "1",
    name: "Tú",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
    isOwn: true,
    hasUnseen: false,
  },
  {
    id: "2",
    name: "Marcos",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    hasUnseen: true,
  },
  {
    id: "3",
    name: "Juani",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    hasUnseen: true,
  },
  {
    id: "4",
    name: "Sofi",
    avatarUrl: "https://i.pravatar.cc/150?img=15",
    hasUnseen: false,
  },
  {
    id: "5",
    name: "Jay Sorsc",
    avatarUrl: "https://i.pravatar.cc/150?img=20",
    hasUnseen: true,
  },
  {
    id: "6",
    name: "Samuel Vi...",
    avatarUrl: "https://i.pravatar.cc/150?img=25",
    hasUnseen: false,
  },
];
export default MOCK_USERS;
