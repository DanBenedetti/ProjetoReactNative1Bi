import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";

import CampoFormulario from "../components/FormField";
import {
  BotaoContorno,
  BotaoPrincipal,
  LogoMarca,
  Marca,
  MarcaDestaque,
  MarcaSubtitulo,
  RolagemFormulario,
  TextoBotaoContorno,
  TextoBotaoPrincipal,
  TextoSuave,
} from "../styles";
import { useTema } from "../contexts/ThemeContext";

/**
 * Tela 1 - LOGIN
 * Campos: Usuário e Senha.
 * Botões: ENTRAR (vai para os CARDS) e CADASTRAR USUÁRIO.
 *
 * O "Usuário" é o e-mail informado no cadastro.
 */
const Entrar = () => {
  const navegacao = useNavigation();
  const rota = useRoute();
  const { cores } = useTema();

  const [formulario, definirFormulario] = useState({ usuario: "", senha: "" });
  const [carregando, definirCarregando] = useState(false);

  // Quando o cadastro termina, o e-mail volta como parâmetro e já vem preenchido.
  useEffect(() => {
    const email = rota.params?.email;
    if (email) {
      definirFormulario((atual) => ({ ...atual, usuario: email, senha: "" }));
    }
  }, [rota.params?.email]);

  const alterarCampo = (campo) => (valor) =>
    definirFormulario((atual) => ({ ...atual, [campo]: valor }));

  const fazerLogin = async () => {
    const usuario = formulario.usuario.trim();

    if (!usuario || !formulario.senha) {
      Alert.alert("Atenção", "Preencha o usuário e a senha.");
      return;
    }

    try {
      definirCarregando(true);

      // Os dados do usuário ficam salvos localmente (AsyncStorage = LocalStorage do RN).
      const armazenado = await AsyncStorage.getItem("user");
      if (!armazenado) {
        Alert.alert(
          "Nenhum usuário cadastrado",
          "Toque em CADASTRAR USUÁRIO para criar a sua conta.",
        );
        return;
      }

      const usuarioCadastrado = JSON.parse(armazenado);
      const usuarioConfere =
        String(usuarioCadastrado.email || "").toLowerCase() ===
        usuario.toLowerCase();
      const senhaConfere = usuarioCadastrado.senha === formulario.senha;

      if (usuarioConfere && senhaConfere) {
        navegacao.navigate("cards");
      } else {
        Alert.alert("Acesso negado", "Usuário ou senha inválidos.");
      }
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível ler os dados do usuário.");
    } finally {
      definirCarregando(false);
    }
  };

  return (
    <RolagemFormulario
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 28,
        paddingBottom: 40,
      }}
    >
      <LogoMarca>
        <MaterialIcons name="movie" size={34} color={cores.primaria} />
      </LogoMarca>

      <Marca>
        RN
        <MarcaDestaque>TMDB</MarcaDestaque>
      </Marca>
      <MarcaSubtitulo>
        Monte a sua lista de filmes e séries e descubra o que assistir hoje.
      </MarcaSubtitulo>

      <CampoFormulario
        rotulo="Usuário"
        placeholder="Digite seu e-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={formulario.usuario}
        onChangeText={alterarCampo("usuario")}
      />

      <CampoFormulario
        rotulo="Senha"
        placeholder="Digite sua senha"
        secureTextEntry
        autoCapitalize="none"
        value={formulario.senha}
        onChangeText={alterarCampo("senha")}
      />

      <BotaoPrincipal onPress={fazerLogin} disabled={carregando}>
        <TextoBotaoPrincipal>
          {carregando ? "Entrando..." : "Entrar"}
        </TextoBotaoPrincipal>
      </BotaoPrincipal>

      <BotaoContorno onPress={() => navegacao.navigate("cadastro")}>
        <TextoBotaoContorno>Cadastrar usuário</TextoBotaoContorno>
      </BotaoContorno>

      <TextoSuave style={{ marginTop: 22, textAlign: "center" }}>
        Os dados ficam salvos apenas neste aparelho.
      </TextoSuave>
    </RolagemFormulario>
  );
};

export default Entrar;
