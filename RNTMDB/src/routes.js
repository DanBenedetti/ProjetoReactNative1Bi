import React from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";

import Detail from "./pages/details";
import Cadastro from "./pages/cadastro";
import Login from "./pages/login";
import Main from "./pages/main";
import { useTheme } from "./contexts/ThemeContext";

const Stack = createStackNavigator();

/** Estilo comum de todos os cabeçalhos (igual ao projeto GitViewer). */
const headerOptions = (colors) => ({
  headerTitleAlign: "center",
  headerStyle: { backgroundColor: colors.header },
  headerTitleStyle: { fontWeight: "bold", color: colors.headerText },
  headerTintColor: colors.headerText,
});

/** Botões do cabeçalho da tela de CARDS: alternar tema e sair. */
const MainHeaderRight = ({ navigation }) => {
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <MaterialIcons
        name={isDark ? "light-mode" : "dark-mode"}
        size={22}
        color={colors.headerText}
        style={{ marginRight: 18 }}
        onPress={toggleTheme}
      />
      <MaterialIcons
        name="logout"
        size={24}
        color={colors.headerText}
        style={{ marginRight: 15 }}
        onPress={() => navigation.replace("login")}
      />
    </View>
  );
};

export default function Routes() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator screenOptions={headerOptions(colors)}>
      <Stack.Screen
        name="login"
        component={Login}
        options={{ title: "LOGIN", headerLeft: null }}
      />

      <Stack.Screen
        name="cadastro"
        component={Cadastro}
        options={{ title: "CADASTRAR USUÁRIO" }}
      />

      <Stack.Screen
        name="main"
        component={Main}
        options={({ navigation }) => ({
          title: "MEUS CARDS",
          headerLeft: null,
          headerRight: () => <MainHeaderRight navigation={navigation} />,
        })}
      />

      <Stack.Screen
        name="details"
        component={Detail}
        options={{ title: "DETALHES" }}
      />
    </Stack.Navigator>
  );
}
