import React, { useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import FormField from "../components/FormField";
import {
  FormBody,
  FormScroll,
  PrimaryButton,
  PrimaryButtonText,
  SectionTitle,
} from "../styles";
import { useTheme } from "../contexts/ThemeContext";
import { isValidCPF, isValidEmail, isValidPhone, maskCPF, maskPhone } from "../utils/validators";

/**
 * Tela 2 - CADASTRAR USUÁRIO
 * Campos exigidos: Nome, Telefone, CPF, E-mail e Curso.
 * O campo Senha foi incluído porque a tela de LOGIN pede usuário e senha.
 * O botão SALVAR grava tudo no AsyncStorage e volta para o LOGIN.
 */

const INITIAL_FORM = {
  nome: "",
  telefone: "",
  cpf: "",
  email: "",
  senha: "",
  curso: "",
};

/** Validação pura: recebe o formulário e devolve os erros por campo. */
const validate = (form) => {
  const errors = {};

  if (form.nome.trim().length < 3) {
    errors.nome = "Informe o nome completo (mínimo 3 caracteres).";
  }
  if (!isValidPhone(form.telefone)) {
    errors.telefone = "Telefone inválido. Use (DD) 99999-9999.";
  }
  if (!isValidCPF(form.cpf)) {
    errors.cpf = "CPF inválido. Confira os números digitados.";
  }
  if (!isValidEmail(form.email)) {
    errors.email = "E-mail inválido. Ex.: nome@email.com";
  }
  if (form.senha.length < 6) {
    errors.senha = "A senha precisa ter pelo menos 6 caracteres.";
  }
  if (form.curso.trim().length < 2) {
    errors.curso = "Informe o curso. Ex.: DSM";
  }

  return errors;
};

const MASKS = { telefone: maskPhone, cpf: maskCPF };

const Cadastro = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  // Os erros são calculados a partir do formulário (sem estado duplicado).
  const errors = useMemo(() => validate(form), [form]);

  // Só mostra o erro depois da primeira tentativa de salvar, para não
  // "gritar" com o usuário enquanto ele ainda está digitando.
  const errorFor = (key) => (submitted ? errors[key] : undefined);

  const handleChange = (key) => (value) => {
    const mask = MASKS[key];
    setForm((current) => ({ ...current, [key]: mask ? mask(value) : value }));
  };

  const handleSalvar = async () => {
    setSubmitted(true);

    if (Object.keys(errors).length > 0) {
      Alert.alert("Verifique os campos", "Alguns dados precisam ser corrigidos.");
      return;
    }

    try {
      const user = {
        nome: form.nome.trim(),
        telefone: form.telefone.trim(),
        cpf: form.cpf.trim(),
        email: form.email.trim().toLowerCase(),
        senha: form.senha,
        curso: form.curso.trim(),
        criadoEm: new Date().toISOString(),
      };

      await AsyncStorage.setItem("user", JSON.stringify(user));

      Alert.alert("Tudo certo!", "Usuário cadastrado com sucesso.", [
        {
          text: "Ir para o login",
          onPress: () => navigation.navigate("login", { email: user.email }),
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar os dados do usuário.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FormScroll>
        <SectionTitle>Seus dados</SectionTitle>
        <FormBody>
          <FormField
            label="Nome"
            placeholder="Nome completo"
            autoCapitalize="words"
            value={form.nome}
            onChangeText={handleChange("nome")}
            error={errorFor("nome")}
          />

          <FormField
            label="Telefone"
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
            maxLength={15}
            value={form.telefone}
            onChangeText={handleChange("telefone")}
            error={errorFor("telefone")}
          />

          <FormField
            label="CPF"
            placeholder="000.000.000-00"
            keyboardType="number-pad"
            maxLength={14}
            value={form.cpf}
            onChangeText={handleChange("cpf")}
            error={errorFor("cpf")}
          />

          <FormField
            label="E-mail"
            placeholder="nome@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={form.email}
            onChangeText={handleChange("email")}
            error={errorFor("email")}
          />

          <FormField
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            autoCapitalize="none"
            value={form.senha}
            onChangeText={handleChange("senha")}
            error={errorFor("senha")}
          />

          <FormField
            label="Curso"
            placeholder="Ex.: DSM - Desenvolvimento de Software Multiplataforma"
            autoCapitalize="words"
            value={form.curso}
            onChangeText={handleChange("curso")}
            error={errorFor("curso")}
          />

          <View style={{ height: 12 }} />

          <PrimaryButton onPress={handleSalvar}>
            <PrimaryButtonText>Salvar</PrimaryButtonText>
          </PrimaryButton>
        </FormBody>
      </FormScroll>
    </KeyboardAvoidingView>
  );
};

export default Cadastro;
