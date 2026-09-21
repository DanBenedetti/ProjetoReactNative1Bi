import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";

import FormField from "../components/FormField";
import {
  Brand,
  BrandHighlight,
  BrandSubtitle,
  FormScroll,
  LogoMark,
  MutedText,
  OutlineButton,
  OutlineButtonText,
  PrimaryButton,
  PrimaryButtonText,
} from "../styles";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Tela 1 - LOGIN
 * Campos: Usuário e Senha.
 * Botões: ENTRAR (vai para os CARDS) e CADASTRAR USUÁRIO.
 *
 * O "Usuário" é o e-mail informado no cadastro.
 */
const Login = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();

  const [form, setForm] = useState({ usuario: "", senha: "" });
  const [loading, setLoading] = useState(false);

  // Quando o cadastro termina, o e-mail volta como parâmetro e já vem preenchido.
  useEffect(() => {
    const email = route.params?.email;
    if (email) {
      setForm((current) => ({ ...current, usuario: email, senha: "" }));
    }
  }, [route.params?.email]);

  const handleChange = (key) => (value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleLogin = async () => {
    const usuario = form.usuario.trim();

    if (!usuario || !form.senha) {
      Alert.alert("Atenção", "Preencha o usuário e a senha.");
      return;
    }

    try {
      setLoading(true);

      // Os dados do usuário ficam salvos localmente (AsyncStorage = LocalStorage do RN).
      const stored = await AsyncStorage.getItem("user");
      if (!stored) {
        Alert.alert(
          "Nenhum usuário cadastrado",
          "Toque em CADASTRAR USUÁRIO para criar a sua conta.",
        );
        return;
      }

      const user = JSON.parse(stored);
      const usuarioConfere =
        String(user.email || "").toLowerCase() === usuario.toLowerCase();
      const senhaConfere = user.senha === form.senha;

      if (usuarioConfere && senhaConfere) {
        navigation.navigate("main");
      } else {
        Alert.alert("Acesso negado", "Usuário ou senha inválidos.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível ler os dados do usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormScroll
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 28,
        paddingBottom: 40,
      }}
    >
      <LogoMark>
        <MaterialIcons name="movie" size={34} color={colors.primary} />
      </LogoMark>

      <Brand>
        RN
        <BrandHighlight>TMDB</BrandHighlight>
      </Brand>
      <BrandSubtitle>
        Monte a sua lista de filmes e séries e descubra o que assistir hoje.
      </BrandSubtitle>

      <FormField
        label="Usuário"
        placeholder="Digite seu e-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={form.usuario}
        onChangeText={handleChange("usuario")}
      />

      <FormField
        label="Senha"
        placeholder="Digite sua senha"
        secureTextEntry
        autoCapitalize="none"
        value={form.senha}
        onChangeText={handleChange("senha")}
      />

      <PrimaryButton onPress={handleLogin} disabled={loading}>
        <PrimaryButtonText>{loading ? "Entrando..." : "Entrar"}</PrimaryButtonText>
      </PrimaryButton>

      <OutlineButton onPress={() => navigation.navigate("cadastro")}>
        <OutlineButtonText>Cadastrar usuário</OutlineButtonText>
      </OutlineButton>

      <MutedText style={{ marginTop: 22, textAlign: "center" }}>
        Os dados ficam salvos apenas neste aparelho.
      </MutedText>
    </FormScroll>
  );
};

export default Login;
