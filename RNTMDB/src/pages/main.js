import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Modal,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import CardDeFilme from "../components/MovieCard";
import AbasSegmento from "../components/SegmentTabs";
import {
  BotaoBuscar,
  BotaoContorno,
  BotaoLimpar,
  BotaoPrincipal,
  BotaoRoleta,
  CabecalhoResultados,
  CaixaAviso,
  CaixaCarregando,
  CaixaMensagem,
  CampoBusca,
  DicaSaudacao,
  EstadoVazio,
  EtiquetaStatus,
  FundoModal,
  LinhaBusca,
  LinhaSaudacao,
  Lista,
  PontoStatus,
  PosterAlternativo,
  PosterDetalhes,
  QuadroModal,
  RodapeCarregando,
  Saudacao,
  SeloNota,
  Tela,
  TextoAviso,
  TextoBotaoContorno,
  TextoBotaoLimpar,
  TextoBotaoPrincipal,
  TextoBotaoRoleta,
  TextoMensagem,
  TextoModal,
  TextoNota,
  TextoStatus,
  TextoSuave,
  TextoVazio,
  TituloModal,
  TituloVazio,
} from "../styles";
import {
  buscarDestaques,
  buscarDetalhes,
  buscarTitulos,
} from "../services/api";
import { temChaveApi } from "../config/tmdb";
import { useBiblioteca } from "../contexts/LibraryContext";
import { useTema } from "../contexts/ThemeContext";
import {
  CATEGORIAS,
  chaveDoCartao,
  formatarNota,
  juntarSemRepetir,
  normalizarDetalhes,
  normalizarResultadoBusca,
  urlPoster,
} from "../utils/format";

/**
 * Tela 3 - CARDS
 *
 * O requisito "status" do card vem do campo "status" da própria API do TMDb
 * (ex.: "Released" -> "Lançado", "Returning Series" -> "Em exibição").
 * Como a busca e o feed de destaques não devolvem esse campo, ao tocar em ADD
 * o app busca os detalhes completos do título antes de salvar o card.
 */

const SEGMENTOS = [
  { key: "trending", label: "Destaques" },
  { key: "watchlist", label: "Quero ver" },
  { key: "watched", label: "Assistidos" },
  { key: "favorite", label: "Favoritos" },
];

const apenasFilmesESeries = (resultados = []) =>
  resultados
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map(normalizarResultadoBusca);

const Cards = ({ navigation }) => {
  const { cores } = useTema();
  const { itens, adicionarItem, removerItem, estaNaBiblioteca } =
    useBiblioteca();

  const [nomeUsuario, definirNomeUsuario] = useState("");
  const [segmento, definirSegmento] = useState("trending");

  // Busca
  const [busca, definirBusca] = useState("");
  const [ultimaBusca, definirUltimaBusca] = useState("");
  const [resultadosBusca, definirResultadosBusca] = useState(null);
  const [buscando, definirBuscando] = useState(false);

  // Destaques (com paginação)
  const [destaques, definirDestaques] = useState({
    itens: [],
    pagina: 1,
    totalPaginas: 1,
    carregando: true,
    carregandoMais: false,
    erro: null,
  });
  const [atualizando, definirAtualizando] = useState(false);

  const [chaveAdicionando, definirChaveAdicionando] = useState(null);
  const [mensagem, definirMensagem] = useState("");
  const [sorteio, definirSorteio] = useState(null);

  /* ---------------------------------------------------------------- *
   * Dados iniciais
   * ---------------------------------------------------------------- */

  useEffect(() => {
    AsyncStorage.getItem("user")
      .then((armazenado) => {
        if (armazenado) definirNomeUsuario(JSON.parse(armazenado).nome || "");
      })
      .catch(() => {});
  }, []);

  // Mensagem de confirmação que aparece por alguns segundos.
  useEffect(() => {
    if (!mensagem) return undefined;
    const temporizador = setTimeout(() => definirMensagem(""), 2500);
    return () => clearTimeout(temporizador);
  }, [mensagem]);

  const carregarDestaques = async (pagina = 1) => {
    if (!temChaveApi()) {
      definirDestaques((atual) => ({ ...atual, carregando: false }));
      return;
    }

    definirDestaques((atual) => ({
      ...atual,
      carregando: pagina === 1,
      carregandoMais: pagina > 1,
      erro: null,
    }));

    try {
      const resposta = await buscarDestaques(pagina);
      const resultados = apenasFilmesESeries(resposta.data.results);

      definirDestaques((atual) => ({
        // A partir da página 2 as novidades entram sem repetir o que já
        // estava na tela (o TMDb pode devolver o mesmo título em duas páginas).
        itens:
          pagina === 1
            ? resultados
            : juntarSemRepetir(atual.itens, resultados),
        pagina,
        totalPaginas: resposta.data.total_pages || 1,
        carregando: false,
        carregandoMais: false,
        erro: null,
      }));
    } catch (erro) {
      definirDestaques((atual) => ({
        ...atual,
        carregando: false,
        carregandoMais: false,
        erro: erro.friendlyMessage || "Não foi possível carregar os destaques.",
      }));
    }
  };

  useEffect(() => {
    carregarDestaques(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------------------------------------------------------- *
   * Ações
   * ---------------------------------------------------------------- */

  const atualizar = async () => {
    definirAtualizando(true);
    await carregarDestaques(1);
    definirAtualizando(false);
  };

  const carregarMais = () => {
    if (resultadosBusca) return;
    if (segmento !== "trending") return;
    if (destaques.carregando || destaques.carregandoMais) return;
    if (destaques.itens.length === 0) return;
    if (destaques.pagina >= destaques.totalPaginas) return;
    carregarDestaques(destaques.pagina + 1);
  };

  const buscar = async () => {
    const termo = busca.trim();
    Keyboard.dismiss();

    if (!termo) {
      definirResultadosBusca(null);
      definirUltimaBusca("");
      return;
    }

    if (!temChaveApi()) {
      Alert.alert(
        "API Key não configurada",
        "Abra o arquivo .env, cole a sua chave do TMDb e reinicie o app.",
      );
      return;
    }

    try {
      definirBuscando(true);
      const resposta = await buscarTitulos(termo);
      const resultados = apenasFilmesESeries(resposta.data.results);
      definirUltimaBusca(termo);
      definirResultadosBusca(resultados);

      if (resultados.length === 0) {
        Alert.alert("Nada encontrado", `Nenhum filme ou série para "${termo}".`);
      }
    } catch (erro) {
      Alert.alert("Erro na busca", erro.friendlyMessage || "Tente novamente.");
    } finally {
      definirBuscando(false);
    }
  };

  const limparBusca = () => {
    definirResultadosBusca(null);
    definirUltimaBusca("");
    definirBusca("");
    Keyboard.dismiss();
  };

  /** Botão ADD: busca os detalhes completos e salva o card na biblioteca. */
  const adicionar = async (item) => {
    const chave = chaveDoCartao(item);

    if (estaNaBiblioteca(chave)) {
      definirMensagem(`"${item.title}" já está na sua lista.`);
      return;
    }

    try {
      definirChaveAdicionando(chave);
      const resposta = await buscarDetalhes(item.mediaType, item.id);
      const cartao = {
        ...normalizarDetalhes(item.mediaType, resposta.data),
        category: "watchlist",
        userRating: 0,
      };

      const adicionado = adicionarItem(cartao);
      definirMensagem(
        adicionado
          ? `${cartao.title} foi adicionado em "${CATEGORIAS.watchlist}".`
          : `"${cartao.title}" já está na sua lista.`,
      );
    } catch (erro) {
      Alert.alert(
        "Erro ao adicionar",
        erro.friendlyMessage || "Não foi possível buscar os detalhes.",
      );
    } finally {
      definirChaveAdicionando(null);
    }
  };

  const remover = (item) => {
    Alert.alert("Excluir card", `Remover "${item.title}" da sua lista?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          removerItem(chaveDoCartao(item));
          definirMensagem(`"${item.title}" foi removido.`);
        },
      },
    ]);
  };

  /** Roleta: sorteia um título da lista do usuário. */
  const sortear = () => {
    if (itens.length === 0) {
      Alert.alert(
        "Lista vazia",
        "Adicione pelo menos um filme ou série para usar a roleta.",
      );
      return;
    }
    const escolhido = itens[Math.floor(Math.random() * itens.length)];
    definirSorteio(escolhido);
  };

  /* ---------------------------------------------------------------- *
   * Lista exibida
   * ---------------------------------------------------------------- */

  const dadosDaLista = useMemo(() => {
    if (resultadosBusca) return resultadosBusca;
    if (segmento === "trending") return destaques.itens;
    return itens.filter((item) => item.category === segmento);
  }, [resultadosBusca, segmento, destaques.itens, itens]);

  const listaDaApi = Boolean(resultadosBusca) || segmento === "trending";

  const primeiroNome = nomeUsuario ? nomeUsuario.split(" ")[0] : "";

  const renderizarVazio = () => {
    if (listaDaApi) {
      if (resultadosBusca) {
        return (
          <EstadoVazio>
            <MaterialIcons name="search-off" size={40} color={cores.textoSuave} />
            <TituloVazio>Nenhum resultado</TituloVazio>
            <TextoVazio>
              Não encontramos filmes ou séries para "{ultimaBusca}".
            </TextoVazio>
          </EstadoVazio>
        );
      }

      if (destaques.carregando) {
        return (
          <CaixaCarregando>
            <ActivityIndicator color={cores.primaria} size="large" />
            <TextoSuave style={{ marginTop: 12 }}>
              Carregando destaques do TMDb...
            </TextoSuave>
          </CaixaCarregando>
        );
      }

      return (
        <EstadoVazio>
          <MaterialIcons
            name={destaques.erro ? "cloud-off" : "movie"}
            size={40}
            color={cores.textoSuave}
          />
          <TituloVazio>
            {destaques.erro ? "Não deu para carregar" : "Sem destaques"}
          </TituloVazio>
          <TextoVazio>
            {destaques.erro || "Tente novamente em instantes."}
          </TextoVazio>
          <BotaoPrincipal
            onPress={() => carregarDestaques(1)}
            style={{ marginTop: 16, width: 200 }}
          >
            <TextoBotaoPrincipal>Tentar novamente</TextoBotaoPrincipal>
          </BotaoPrincipal>
        </EstadoVazio>
      );
    }

    return (
      <EstadoVazio>
        <MaterialIcons name="bookmark-outline" size={40} color={cores.textoSuave} />
        <TituloVazio>{CATEGORIAS[segmento]}</TituloVazio>
        <TextoVazio>
          Sua lista está vazia. Busque um filme ou série na barra acima e toque
          em ADD para montar a sua coleção.
        </TextoVazio>
      </EstadoVazio>
    );
  };

  const renderizarItem = ({ item }) => {
    const chave = chaveDoCartao(item);

    if (listaDaApi) {
      // Quando o título já está na lista, abrimos os detalhes com o card
      // completo que está salvo (com status e gêneros), e não com o resultado resumido.
      const salvo = itens.find((registro) => chaveDoCartao(registro) === chave);

      return (
        <CardDeFilme
          item={item}
          jaAdicionado={Boolean(salvo)}
          carregando={chaveAdicionando === chave}
          aoAdicionar={() => adicionar(item)}
          aoVerDetalhes={
            salvo
              ? () => navigation.navigate("detalhes", { cartao: salvo })
              : undefined
          }
        />
      );
    }

    return (
      <CardDeFilme
        item={item}
        aoVerDetalhes={() => navigation.navigate("detalhes", { cartao: item })}
        aoRemover={() => remover(item)}
      />
    );
  };

  const posterDoSorteio = sorteio ? urlPoster(sorteio.posterPath) : null;

  return (
    <Tela>
      <LinhaSaudacao>
        <Saudacao>
          Olá{primeiroNome ? `, ${primeiroNome}` : ""} 👋
        </Saudacao>
        <DicaSaudacao>
          {itens.length > 0
            ? `${itens.length} ${itens.length === 1 ? "título salvo" : "títulos salvos"} na sua lista`
            : "Sua lista ainda está vazia"}
        </DicaSaudacao>
      </LinhaSaudacao>

      <LinhaBusca>
        <CampoBusca
          placeholder="Buscar filme ou série"
          value={busca}
          onChangeText={definirBusca}
          returnKeyType="search"
          onSubmitEditing={buscar}
          autoCorrect={false}
        />
        <BotaoBuscar onPress={buscar} $carregando={buscando}>
          {buscando ? (
            <ActivityIndicator color="#06283d" size="small" />
          ) : (
            <MaterialIcons name="search" size={22} color="#06283d" />
          )}
        </BotaoBuscar>
      </LinhaBusca>

      {!temChaveApi() ? (
        <CaixaAviso>
          <MaterialIcons name="vpn-key" size={18} color={cores.perigo} />
          <TextoAviso>
            API Key do TMDb não configurada. Abra o arquivo .env na raiz do
            projeto, cole o valor em EXPO_PUBLIC_TMDB_API_KEY e rode
            "npx expo start --clear".
          </TextoAviso>
        </CaixaAviso>
      ) : null}

      {mensagem ? (
        <CaixaMensagem>
          <TextoMensagem>{mensagem}</TextoMensagem>
        </CaixaMensagem>
      ) : null}

      {resultadosBusca ? (
        <CabecalhoResultados>
          <TextoSuave>
            {resultadosBusca.length} resultado
            {resultadosBusca.length === 1 ? "" : "s"} para "{ultimaBusca}"
          </TextoSuave>
          <BotaoLimpar onPress={limparBusca}>
            <MaterialIcons name="close" size={14} color={cores.textoSuave} />
            <TextoBotaoLimpar>Limpar</TextoBotaoLimpar>
          </BotaoLimpar>
        </CabecalhoResultados>
      ) : (
        <AbasSegmento
          segmentos={SEGMENTOS}
          ativo={segmento}
          aoMudar={definirSegmento}
        />
      )}

      <Lista
        data={dadosDaLista}
        keyExtractor={(item) => chaveDoCartao(item)}
        renderItem={renderizarItem}
        ListEmptyComponent={renderizarVazio}
        ListFooterComponent={
          destaques.carregandoMais && !resultadosBusca ? (
            <RodapeCarregando>
              <ActivityIndicator color={cores.primaria} />
            </RodapeCarregando>
          ) : null
        }
        onEndReached={carregarMais}
        onEndReachedThreshold={0.4}
        refreshControl={
          !resultadosBusca && segmento === "trending" ? (
            <RefreshControl
              refreshing={atualizando}
              onRefresh={atualizar}
              tintColor={cores.primaria}
            />
          ) : undefined
        }
      />

      {itens.length > 0 && !resultadosBusca ? (
        <BotaoRoleta onPress={sortear}>
          <MaterialIcons name="casino" size={22} color="#06283d" />
          <TextoBotaoRoleta>O que assistir?</TextoBotaoRoleta>
        </BotaoRoleta>
      ) : null}

      <Modal
        visible={Boolean(sorteio)}
        transparent
        animationType="fade"
        onRequestClose={() => definirSorteio(null)}
      >
        {/* No Android o Modal é desenhado fora da árvore raiz do app, então os
            RectButton daqui de dentro precisam de uma nova raiz do Gesture
            Handler para receber o toque (exigência da própria biblioteca). */}
        <GestureHandlerRootView style={{ flex: 1 }}>
          <FundoModal onPress={() => definirSorteio(null)}>
            <QuadroModal onPress={() => {}}>
              <TituloModal>Sorteio da roleta</TituloModal>
              <TextoModal style={{ marginBottom: 14 }}>
                Que tal assistir agora?
              </TextoModal>

              {posterDoSorteio ? (
                <PosterDetalhes source={{ uri: posterDoSorteio }} />
              ) : (
                <PosterAlternativo>
                  <MaterialIcons
                    name="movie"
                    size={28}
                    color={cores.textoSuave}
                  />
                </PosterAlternativo>
              )}

              <TituloModal style={{ marginTop: 12 }}>
                {sorteio?.title}
              </TituloModal>

              <EtiquetaStatus>
                <PontoStatus />
                <TextoStatus>
                  {sorteio?.statusLabel || "Salvo na sua lista"}
                </TextoStatus>
              </EtiquetaStatus>

              <SeloNota
                $nota={sorteio?.voteAverage || 0}
                style={{ marginTop: 10 }}
              >
                <TextoNota>{formatarNota(sorteio?.voteAverage || 0)}</TextoNota>
              </SeloNota>

              <BotaoPrincipal
                onPress={() => {
                  const cartao = sorteio;
                  definirSorteio(null);
                  navigation.navigate("detalhes", { cartao });
                }}
              >
                <TextoBotaoPrincipal>Ver detalhes</TextoBotaoPrincipal>
              </BotaoPrincipal>

              <BotaoContorno onPress={sortear}>
                <TextoBotaoContorno>Sortear de novo</TextoBotaoContorno>
              </BotaoContorno>

              <TextoSuave style={{ marginTop: 12 }}>
                Toque fora do quadro para fechar.
              </TextoSuave>
            </QuadroModal>
          </FundoModal>
        </GestureHandlerRootView>
      </Modal>
    </Tela>
  );
};

export default Cards;
