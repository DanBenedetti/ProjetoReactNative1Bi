import React from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";

import Detalhes from "./pages/details";
import Cadastro from "./pages/cadastro";
import Entrar from "./pages/login";
import Cards from "./pages/main";
import { useTema } from "./contexts/ThemeContext";

const Pilha = createStackNavigator();

/** Estilo comum de todos os cabeçalhos (igual ao projeto GitViewer). */
const opcoesCabecalho = (cores) => ({
  headerTitleAlign: "center",
  headerStyle: { backgroundColor: cores.cabecalho },
  headerTitleStyle: { fontWeight: "bold", color: cores.textoCabecalho },
  headerTintColor: cores.textoCabecalho,
});

/** Botões do cabeçalho da tela de CARDS: alternar tema e sair. */
const BotoesCabecalhoCards = ({ navegacao }) => {
  const { temaEscuro, alternarTema, cores } = useTema();

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <MaterialIcons
        name={temaEscuro ? "light-mode" : "dark-mode"}
        size={22}
        color={cores.textoCabecalho}
        style={{ marginRight: 18 }}
        onPress={alternarTema}
      />
      <MaterialIcons
        name="logout"
        size={24}
        color={cores.textoCabecalho}
        style={{ marginRight: 15 }}
        onPress={() => navegacao.replace("entrar")}
      />
    </View>
  );
};

export default function Rotas() {
  const { cores } = useTema();

  return (
    <Pilha.Navigator screenOptions={opcoesCabecalho(cores)}>
      <Pilha.Screen
        name="entrar"
        component={Entrar}
        options={{ title: "LOGIN", headerLeft: null }}
      />

      <Pilha.Screen
        name="cadastro"
        component={Cadastro}
        options={{ title: "CADASTRAR USUÁRIO" }}
      />

      <Pilha.Screen
        name="cards"
        component={Cards}
        options={({ navigation }) => ({
          title: "MEUS CARDS",
          headerLeft: null,
          headerRight: () => <BotoesCabecalhoCards navegacao={navigation} />,
        })}
      />

      <Pilha.Screen
        name="detalhes"
        component={Detalhes}
        options={{ title: "DETALHES" }}
      />
    </Pilha.Navigator>
  );
}
