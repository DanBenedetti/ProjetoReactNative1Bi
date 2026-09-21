import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider as StyledThemeProvider } from "styled-components/native";

/**
 * Tema "cinema" do app: a paleta escura é inspirada no próprio site do TMDb
 * (azul #032541 no cabeçalho e azul #01B4E4 nos destaques).
 * A escolha do usuário fica salva no AsyncStorage.
 */

const DARK_COLORS = {
  background: "#0D0D0F",
  surface: "#1A1A20",
  surfaceAlt: "#24242C",
  border: "#31313B",
  text: "#F5F5F7",
  textMuted: "#9BA1AC",
  primary: "#01B4E4",
  accent: "#90CEA1",
  danger: "#E50914",
  header: "#032541",
  headerText: "#FFFFFF",
  ratingGood: "#21D07A",
  ratingMid: "#D2D531",
  ratingBad: "#DB2360",
};

const LIGHT_COLORS = {
  background: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceAlt: "#F1F3F6",
  border: "#DDE1E7",
  text: "#0D0D0F",
  textMuted: "#5C6470",
  primary: "#01B4E4",
  accent: "#0F8F6B",
  danger: "#E50914",
  header: "#032541",
  headerText: "#FFFFFF",
  ratingGood: "#1FA85F",
  ratingMid: "#C7A800",
  ratingBad: "#DB2360",
};

const STORAGE_KEY = "theme";

const ThemeContext = createContext({
  mode: "dark",
  isDark: true,
  colors: DARK_COLORS,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("dark");
  const [ready, setReady] = useState(false);

  // Recupera o tema salvo antes de montar a interface.
  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (active && (saved === "light" || saved === "dark")) {
          setMode(saved);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((current) => {
      const next = current === "dark" ? "light" : "dark";
      AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
      return next;
    });
  }, []);

  const colors = mode === "dark" ? DARK_COLORS : LIGHT_COLORS;

  const value = useMemo(
    () => ({ mode, isDark: mode === "dark", colors, toggleTheme }),
    [mode, colors, toggleTheme],
  );

  if (!ready) return null;

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={{ colors, mode }}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

/** Atalho para acessar as cores dentro das telas (ex.: ícones e StatusBar). */
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
