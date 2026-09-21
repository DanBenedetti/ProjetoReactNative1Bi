import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import Routes from "./src/routes";
import { LibraryProvider } from "./src/contexts/LibraryContext";
import { ThemeProvider, useTheme } from "./src/contexts/ThemeContext";

/**
 * Aplica o tema (claro/escuro) também na navegação, para o fundo das telas
 * e o cabeçalho acompanharem a escolha do usuário.
 */
const Navigation = () => {
  const { mode, colors } = useTheme();
  const base = mode === "dark" ? DarkTheme : DefaultTheme;

  const navigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: colors.background,
      card: colors.header,
      text: colors.text,
      primary: colors.primary,
      border: colors.border,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style="light" />
      <Routes />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <LibraryProvider>
          <Navigation />
        </LibraryProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
