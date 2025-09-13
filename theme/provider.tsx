// theme/provider.tsx
import React, { createContext, useContext, useMemo, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";
import { Tokens, lightTokens, darkTokens } from "./tokens";

type ThemeCtx = { tokens: Tokens; colorScheme: ColorSchemeName; setScheme: (s: ColorSchemeName)=>void; };

const ThemeContext = createContext<ThemeCtx>({ tokens: lightTokens, colorScheme: "light", setScheme: ()=>{} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [scheme, setScheme] = useState<ColorSchemeName>(Appearance.getColorScheme() ?? "light");
  const tokens = useMemo(() => (scheme === "dark" ? darkTokens : lightTokens), [scheme]);
  return <ThemeContext.Provider value={{ tokens, colorScheme: scheme, setScheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
