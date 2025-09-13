// theme/tokens.ts
export type ColorScale = {
  [k: number]: string; // ej: 50..950
};

export type Palette = {
  neutral: ColorScale;
  coral: ColorScale;
  success: string;
  warning: string;
  destructive: string;
  brand: string;
};

export type Semantic = {
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  border: string;
  ring: string;
  sidebar: {
    bg: string;
    fg: string;
    border: string;
    primary: string;
    accent: string;
    accentFg: string;
    ring: string;
  };
};

export type Typography = {
  fontFamily: {
    app: string;
    display: string;
    mono: string;
  };
  fontSize: {
    xs: number; sm: number; base: number; lg: number; xl: number; "2xl": number; "3xl": number;
    caption: number;
  };
  lineHeight: {
    tight: number; normal: number; relaxed: number;
  };
};

export type Radii = { sm: number; md: number; lg: number; full: number; };

export type Shadows = {
  button: { shadowColor: string; shadowOpacity: number; shadowRadius: number; shadowOffset: { width:number; height:number }; elevation: number; };
  card:   { shadowColor: string; shadowOpacity: number; shadowRadius: number; shadowOffset: { width:number; height:number }; elevation: number; };
};

export type Spacing = { xs:number; sm:number; md:number; lg:number; xl:number; };

export type Touch = { sm:number; md:number; lg:number; xl:number; };

export type Tokens = {
  palette: Palette;
  semantic: Semantic;
  typography: Typography;
  radii: Radii;
  shadows: Shadows;
  spacing: Spacing;
  touch: Touch;
};

export const lightTokens: Tokens = {
  palette: {
    neutral: { 50:"#F9FAFB",100:"#F3F4F6",200:"#E5E7EB",300:"#D1D5DB",400:"#9CA3AF",500:"#6B7280",600:"#4B5563",700:"#374151",800:"#1F2937",900:"#111827",950:"#0B1220" },
    coral:   { 50:"#FFF3ED",100:"#FFE2D5",200:"#FFC4AC",300:"#FFA785",400:"#FF8A61",500:"#FF6D3F",600:"#FB5A2A",700:"#E14B21",800:"#B73A19",900:"#7A260F",950:"#421409" },
    success: "#10B981",
    warning: "#F59E0B",
    destructive: "#EF4444",
    brand: "#6D28D9",
  },
  semantic: {
    background:"#FFFFFF",
    foreground:"#111827",
    muted:"#F3F4F6",
    mutedForeground:"#374151",
    card:"#FFFFFF",
    cardForeground:"#111827",
    popover:"#FFFFFF",
    popoverForeground:"#111827",
    border:"#E5E7EB",
    ring:"#E9D5FF",
    sidebar: {
      bg:"#F9FAFB",
      fg:"#111827",
      border:"#E5E7EB",
      primary:"#111827",
      accent:"#F3F4F6",
      accentFg:"#111827",
      ring:"#E5E7EB",
    }
  },
  typography: {
    fontFamily: { app:"System", display:"System", mono:"Menlo" },
    fontSize: { xs:12, sm:14, base:16, lg:18, xl:20, "2xl":24, "3xl":30, caption:12 },
    lineHeight: { tight:18, normal:22, relaxed:26 },
  },
  radii: { sm:8, md:12, lg:16, full:999 },
  shadows: {
    button: { shadowColor:"#000", shadowOpacity:0.08, shadowRadius:6, shadowOffset:{ width:0, height:2 }, elevation:2 },
    card:   { shadowColor:"#000", shadowOpacity:0.06, shadowRadius:12, shadowOffset:{ width:0, height:2 }, elevation:3 },
  },
  spacing: { xs:4, sm:8, md:12, lg:16, xl:20 },
  touch: { sm:36, md:44, lg:56, xl:68 },
};

export const darkTokens: Tokens = {
  ...lightTokens,
  semantic: {
    ...lightTokens.semantic,
    background:"#0B1220",
    foreground:"#F3F4F6",
    muted:"#111827",
    mutedForeground:"#9CA3AF",
    card:"#0F172A",
    cardForeground:"#F3F4F6",
    popover:"#0F172A",
    popoverForeground:"#F3F4F6",
    border:"#1F2937",
    ring:"#4C1D95",
    sidebar: {
      bg:"#0F172A",
      fg:"#F3F4F6",
      border:"#1F2937",
      primary:"#F3F4F6",
      accent:"#111827",
      accentFg:"#F3F4F6",
      ring:"#4B5563",
    }
  }
};
