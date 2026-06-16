import {
  Trophy,
  Newspaper,
  MessageSquare,
  User,
  Gem,
  Map,
} from "lucide-react";

export const publicLinks = [
  { path: "/maps", label: "Maps", icon: Map },
  { path: "/sponsors", label: "Brands", icon: Trophy },
  { path: "/blog", label: "Content", icon: MessageSquare },
  // { path: "/tools/valuate", label: "Valuate", icon: Gem },
];

export const buildNavLinks = (user: any) => [
  ...publicLinks,
  ...(user ? [{ path: "/profile", label: "Profile", icon: User }] : []),
];