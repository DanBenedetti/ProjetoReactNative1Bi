import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import Rotas from "./src/routes";
import { ProvedorBiblioteca } from "./src/contexts/LibraryContext";
import { ProvedorTema, useTema } from "./src/contexts/ThemeContext";

/**
 * Aplica o tema (claro/escuro) também na navegação, para o fundo das telas
 * e o cabeçalho acompanharem a escolha do usuário.
 */
const Navegacao = () => {
  const { modo, cores } = useTema();
  const base = modo === "dark" ? DarkTheme : DefaultTheme;

  const temaNavegacao = {
    ...base,
    colors: {
      ...base.colors,
      background: cores.fundo,
      card: cores.cabecalho,
      text: cores.texto,
      primary: cores.primaria,
      border: cores.borda,
    },
  };

  return (
    <NavigationContainer theme={temaNavegacao}>
      <StatusBar style="light" />
      <Rotas />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ProvedorTema>
        <ProvedorBiblioteca>
          <Navegacao />
        </ProvedorBiblioteca>
      </ProvedorTema>
    </GestureHandlerRootView>
  );
}
