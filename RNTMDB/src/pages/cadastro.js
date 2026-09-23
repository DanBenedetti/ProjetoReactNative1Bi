import React, { useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import CampoFormulario from "../components/FormField";
import {
  BotaoPrincipal,
  CorpoFormulario,
  RolagemFormulario,
  TextoBotaoPrincipal,
  TituloSecao,
} from "../styles";
import { useTema } from "../contexts/ThemeContext";
import {
  cpfValido,
  emailValido,
  mascararCpf,
  mascararTelefone,
  telefoneValido,
} from "../utils/validators";

/**
 * Tela 2 - CADASTRAR USUÁRIO
 * Campos exigidos: Nome, Telefone, CPF, E-mail e Curso.
 * O campo Senha foi incluído porque a tela de LOGIN pede usuário e senha.
 * O botão SALVAR grava tudo no AsyncStorage e volta para o LOGIN.
 */

const FORMULARIO_INICIAL = {
  nome: "",
  telefone: "",
  cpf: "",
  email: "",
  senha: "",
  curso: "",
};

/** Validação pura: recebe o formulário e devolve os erros por campo. */
const validar = (formulario) => {
  const erros = {};

  if (formulario.nome.trim().length < 3) {
    erros.nome = "Informe o nome completo (mínimo 3 caracteres).";
  }
  if (!telefoneValido(formulario.telefone)) {
    erros.telefone = "Telefone inválido. Use (DD) 99999-9999.";
  }
  if (!cpfValido(formulario.cpf)) {
    erros.cpf = "CPF inválido. Confira os números digitados.";
  }
  if (!emailValido(formulario.email)) {
    erros.email = "E-mail inválido. Ex.: nome@email.com";
  }
  if (formulario.senha.length < 6) {
    erros.senha = "A senha precisa ter pelo menos 6 caracteres.";
  }
  if (formulario.curso.trim().length < 2) {
    erros.curso = "Informe o curso. Ex.: DSM";
  }

  return erros;
};

const MASCARAS = { telefone: mascararTelefone, cpf: mascararCpf };

const Cadastro = () => {
  const navegacao = useNavigation();
  const { cores } = useTema();

  const [formulario, definirFormulario] = useState(FORMULARIO_INICIAL);
  const [enviado, definirEnviado] = useState(false);

  // Os erros são calculados a partir do formulário (sem estado duplicado).
  const erros = useMemo(() => validar(formulario), [formulario]);

  // Só mostra o erro depois da primeira tentativa de salvar, para não
  // "gritar" com o usuário enquanto ele ainda está digitando.
  const erroDe = (campo) => (enviado ? erros[campo] : undefined);

  const alterarCampo = (campo) => (valor) => {
    const mascara = MASCARAS[campo];
    definirFormulario((atual) => ({
      ...atual,
      [campo]: mascara ? mascara(valor) : valor,
    }));
  };

  const salvar = async () => {
    definirEnviado(true);

    if (Object.keys(erros).length > 0) {
      Alert.alert("Verifique os campos", "Alguns dados precisam ser corrigidos.");
      return;
    }

    try {
      const usuario = {
        nome: formulario.nome.trim(),
        telefone: formulario.telefone.trim(),
        cpf: formulario.cpf.trim(),
        email: formulario.email.trim().toLowerCase(),
        senha: formulario.senha,
        curso: formulario.curso.trim(),
        criadoEm: new Date().toISOString(),
      };

      await AsyncStorage.setItem("user", JSON.stringify(usuario));

      Alert.alert("Tudo certo!", "Usuário cadastrado com sucesso.", [
        {
          text: "Ir para o login",
          onPress: () => navegacao.navigate("entrar", { email: usuario.email }),
        },
      ]);
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível salvar os dados do usuário.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: cores.fundo }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <RolagemFormulario>
        <TituloSecao>Seus dados</TituloSecao>
        <CorpoFormulario>
          <CampoFormulario
            rotulo="Nome"
            placeholder="Nome completo"
            autoCapitalize="words"
            value={formulario.nome}
            onChangeText={alterarCampo("nome")}
            erro={erroDe("nome")}
          />

          <CampoFormulario
            rotulo="Telefone"
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
            maxLength={15}
            value={formulario.telefone}
            onChangeText={alterarCampo("telefone")}
            erro={erroDe("telefone")}
          />

          <CampoFormulario
            rotulo="CPF"
            placeholder="000.000.000-00"
            keyboardType="number-pad"
            maxLength={14}
            value={formulario.cpf}
            onChangeText={alterarCampo("cpf")}
            erro={erroDe("cpf")}
          />

          <CampoFormulario
            rotulo="E-mail"
            placeholder="nome@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={formulario.email}
            onChangeText={alterarCampo("email")}
            erro={erroDe("email")}
          />

          <CampoFormulario
            rotulo="Senha"
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            autoCapitalize="none"
            value={formulario.senha}
            onChangeText={alterarCampo("senha")}
            erro={erroDe("senha")}
          />

          <CampoFormulario
            rotulo="Curso"
            placeholder="Ex.: DSM - Desenvolvimento de Software Multiplataforma"
            autoCapitalize="words"
            value={formulario.curso}
            onChangeText={alterarCampo("curso")}
            erro={erroDe("curso")}
          />

          <View style={{ height: 12 }} />

          <BotaoPrincipal onPress={salvar}>
            <TextoBotaoPrincipal>Salvar</TextoBotaoPrincipal>
          </BotaoPrincipal>
        </CorpoFormulario>
      </RolagemFormulario>
    </KeyboardAvoidingView>
  );
};

export default Cadastro;
