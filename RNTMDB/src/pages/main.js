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

import MovieCard from "../components/MovieCard";
import SegmentTabs from "../components/SegmentTabs";
import {
  AddButton,
  ClearButton,
  ClearButtonText,
  DetailPoster,
  DiceButton,
  DiceButtonText,
  EmptyState,
  EmptyText,
  EmptyTitle,
  FeedbackBox,
  FeedbackText,
  FooterLoading,
  Greeting,
  GreetingHint,
  GreetingRow,
  List,
  LoadingBox,
  ModalCard,
  ModalOverlay,
  ModalText,
  ModalTitle,
  MutedText,
  OutlineButton,
  OutlineButtonText,
  PosterFallback,
  PrimaryButton,
  PrimaryButtonText,
  RatingBadge,
  RatingText,
  ResultsHeader,
  Screen,
  SearchInput,
  SearchRow,
  StatusDot,
  StatusTag,
  StatusText,
  WarningBox,
  WarningText,
} from "../styles";
import { getDetails, getTrending, searchTitles } from "../services/api";
import { hasApiKey } from "../config/tmdb";
import { useLibrary } from "../contexts/LibraryContext";
import { useTheme } from "../contexts/ThemeContext";
import {
  CATEGORIES,
  cardKey,
  formatVote,
  normalizeDetails,
  normalizeSearchResult,
  posterUrl,
} from "../utils/format";

/**
 * Tela 3 - CARDS
 *
 * O requisito "status" do card vem do campo "status" da própria API do TMDb
 * (ex.: "Released" -> "Lançado", "Returning Series" -> "Em exibição").
 * Como a busca e o feed de destaques não devolvem esse campo, ao tocar em ADD
 * o app busca os detalhes completos do título antes de salvar o card.
 */

const SEGMENTS = [
  { key: "trending", label: "Destaques" },
  { key: "watchlist", label: "Quero ver" },
  { key: "watched", label: "Assistidos" },
  { key: "favorite", label: "Favoritos" },
];

const onlyMoviesAndSeries = (results = []) =>
  results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map(normalizeSearchResult);

const Main = ({ navigation }) => {
  const { colors } = useTheme();
  const { items, addItem, removeItem, isInLibrary } = useLibrary();

  const [userName, setUserName] = useState("");
  const [segment, setSegment] = useState("trending");

  // Busca
  const [query, setQuery] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  // Destaques (com paginação)
  const [trending, setTrending] = useState({
    items: [],
    page: 1,
    totalPages: 1,
    loading: true,
    loadingMore: false,
    error: null,
  });
  const [refreshing, setRefreshing] = useState(false);

  const [addingKey, setAddingKey] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [roulette, setRoulette] = useState(null);

  /* ---------------------------------------------------------------- *
   * Dados iniciais
   * ---------------------------------------------------------------- */

  useEffect(() => {
    AsyncStorage.getItem("user")
      .then((stored) => {
        if (stored) setUserName(JSON.parse(stored).nome || "");
      })
      .catch(() => {});
  }, []);

  // Mensagem de confirmação que aparece por alguns segundos.
  useEffect(() => {
    if (!feedback) return undefined;
    const timer = setTimeout(() => setFeedback(""), 2500);
    return () => clearTimeout(timer);
  }, [feedback]);

  const loadTrending = async (page = 1) => {
    if (!hasApiKey()) {
      setTrending((current) => ({ ...current, loading: false }));
      return;
    }

    setTrending((current) => ({
      ...current,
      loading: page === 1,
      loadingMore: page > 1,
      error: null,
    }));

    try {
      const response = await getTrending(page);
      const results = onlyMoviesAndSeries(response.data.results);

      setTrending((current) => ({
        items: page === 1 ? results : [...current.items, ...results],
        page,
        totalPages: response.data.total_pages || 1,
        loading: false,
        loadingMore: false,
        error: null,
      }));
    } catch (error) {
      setTrending((current) => ({
        ...current,
        loading: false,
        loadingMore: false,
        error: error.friendlyMessage || "Não foi possível carregar os destaques.",
      }));
    }
  };

  useEffect(() => {
    loadTrending(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------------------------------------------------------- *
   * Ações
   * ---------------------------------------------------------------- */

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTrending(1);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (searchResults) return;
    if (segment !== "trending") return;
    if (trending.loading || trending.loadingMore) return;
    if (trending.items.length === 0) return;
    if (trending.page >= trending.totalPages) return;
    loadTrending(trending.page + 1);
  };

  const handleSearch = async () => {
    const term = query.trim();
    Keyboard.dismiss();

    if (!term) {
      setSearchResults(null);
      setLastQuery("");
      return;
    }

    if (!hasApiKey()) {
      Alert.alert(
        "API Key não configurada",
        "Abra o arquivo .env, cole a sua chave do TMDb e reinicie o app.",
      );
      return;
    }

    try {
      setSearching(true);
      const response = await searchTitles(term);
      const results = onlyMoviesAndSeries(response.data.results);
      setLastQuery(term);
      setSearchResults(results);

      if (results.length === 0) {
        Alert.alert("Nada encontrado", `Nenhum filme ou série para "${term}".`);
      }
    } catch (error) {
      Alert.alert("Erro na busca", error.friendlyMessage || "Tente novamente.");
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchResults(null);
    setLastQuery("");
    setQuery("");
    Keyboard.dismiss();
  };

  /** Botão ADD: busca os detalhes completos e salva o card na biblioteca. */
  const handleAdd = async (item) => {
    const key = cardKey(item);

    if (isInLibrary(key)) {
      setFeedback(`"${item.title}" já está na sua lista.`);
      return;
    }

    try {
      setAddingKey(key);
      const response = await getDetails(item.mediaType, item.id);
      const card = {
        ...normalizeDetails(item.mediaType, response.data),
        category: "watchlist",
        userRating: 0,
      };

      const added = addItem(card);
      setFeedback(
        added
          ? `${card.title} foi adicionado em "${CATEGORIES.watchlist}".`
          : `"${card.title}" já está na sua lista.`,
      );
    } catch (error) {
      Alert.alert(
        "Erro ao adicionar",
        error.friendlyMessage || "Não foi possível buscar os detalhes.",
      );
    } finally {
      setAddingKey(null);
    }
  };

  const handleRemove = (item) => {
    Alert.alert("Excluir card", `Remover "${item.title}" da sua lista?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          removeItem(cardKey(item));
          setFeedback(`"${item.title}" foi removido.`);
        },
      },
    ]);
  };

  /** Roleta: sorteia um título da lista do usuário. */
  const handleRoll = () => {
    if (items.length === 0) {
      Alert.alert(
        "Lista vazia",
        "Adicione pelo menos um filme ou série para usar a roleta.",
      );
      return;
    }
    const picked = items[Math.floor(Math.random() * items.length)];
    setRoulette(picked);
  };

  /* ---------------------------------------------------------------- *
   * Lista exibida
   * ---------------------------------------------------------------- */

  const listData = useMemo(() => {
    if (searchResults) return searchResults;
    if (segment === "trending") return trending.items;
    return items.filter((item) => item.category === segment);
  }, [searchResults, segment, trending.items, items]);

  const isApiList = Boolean(searchResults) || segment === "trending";

  const firstName = userName ? userName.split(" ")[0] : "";

  const renderEmpty = () => {
    if (isApiList) {
      if (searchResults) {
        return (
          <EmptyState>
            <MaterialIcons name="search-off" size={40} color={colors.textMuted} />
            <EmptyTitle>Nenhum resultado</EmptyTitle>
            <EmptyText>
              Não encontramos filmes ou séries para "{lastQuery}".
            </EmptyText>
          </EmptyState>
        );
      }

      if (trending.loading) {
        return (
          <LoadingBox>
            <ActivityIndicator color={colors.primary} size="large" />
            <MutedText style={{ marginTop: 12 }}>
              Carregando destaques do TMDb...
            </MutedText>
          </LoadingBox>
        );
      }

      return (
        <EmptyState>
          <MaterialIcons
            name={trending.error ? "cloud-off" : "movie"}
            size={40}
            color={colors.textMuted}
          />
          <EmptyTitle>
            {trending.error ? "Não deu para carregar" : "Sem destaques"}
          </EmptyTitle>
          <EmptyText>{trending.error || "Tente novamente em instantes."}</EmptyText>
          <PrimaryButton
            onPress={() => loadTrending(1)}
            style={{ marginTop: 16, width: 200 }}
          >
            <PrimaryButtonText>Tentar novamente</PrimaryButtonText>
          </PrimaryButton>
        </EmptyState>
      );
    }

    return (
      <EmptyState>
        <MaterialIcons name="bookmark-outline" size={40} color={colors.textMuted} />
        <EmptyTitle>{CATEGORIES[segment]}</EmptyTitle>
        <EmptyText>
          Sua lista está vazia. Busque um filme ou série na barra acima e toque
          em ADD para montar a sua coleção.
        </EmptyText>
      </EmptyState>
    );
  };

  const renderItem = ({ item }) => {
    const key = cardKey(item);

    if (isApiList) {
      // Quando o título já está na lista, abrimos os detalhes com o card
      // completo que está salvo (com status e gêneros), e não com o resultado resumido.
      const saved = items.find((entry) => cardKey(entry) === key);

      return (
        <MovieCard
          item={item}
          added={Boolean(saved)}
          loading={addingKey === key}
          onAdd={() => handleAdd(item)}
          onPressDetails={
            saved ? () => navigation.navigate("details", { card: saved }) : undefined
          }
        />
      );
    }

    return (
      <MovieCard
        item={item}
        onPressDetails={() => navigation.navigate("details", { card: item })}
        onRemove={() => handleRemove(item)}
      />
    );
  };

  const roulettePoster = roulette ? posterUrl(roulette.posterPath) : null;

  return (
    <Screen>
      <GreetingRow>
        <Greeting>Olá{firstName ? `, ${firstName}` : ""} 👋</Greeting>
        <GreetingHint>
          {items.length > 0
            ? `${items.length} ${items.length === 1 ? "título salvo" : "títulos salvos"} na sua lista`
            : "Sua lista ainda está vazia"}
        </GreetingHint>
      </GreetingRow>

      <SearchRow>
        <SearchInput
          placeholder="Buscar filme ou série"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
          autoCorrect={false}
        />
        <AddButton onPress={handleSearch} $loading={searching}>
          {searching ? (
            <ActivityIndicator color="#06283d" size="small" />
          ) : (
            <MaterialIcons name="search" size={22} color="#06283d" />
          )}
        </AddButton>
      </SearchRow>

      {!hasApiKey() ? (
        <WarningBox>
          <MaterialIcons name="vpn-key" size={18} color={colors.danger} />
          <WarningText>
            API Key do TMDb não configurada. Abra o arquivo .env na raiz do
            projeto, cole o valor em EXPO_PUBLIC_TMDB_API_KEY e rode
            "npx expo start --clear".
          </WarningText>
        </WarningBox>
      ) : null}

      {feedback ? (
        <FeedbackBox>
          <FeedbackText>{feedback}</FeedbackText>
        </FeedbackBox>
      ) : null}

      {searchResults ? (
        <ResultsHeader>
          <MutedText>
            {searchResults.length} resultado
            {searchResults.length === 1 ? "" : "s"} para "{lastQuery}"
          </MutedText>
          <ClearButton onPress={clearSearch}>
            <MaterialIcons name="close" size={14} color={colors.textMuted} />
            <ClearButtonText>Limpar</ClearButtonText>
          </ClearButton>
        </ResultsHeader>
      ) : (
        <SegmentTabs segments={SEGMENTS} active={segment} onChange={setSegment} />
      )}

      <List
        data={listData}
        keyExtractor={(item) => cardKey(item)}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={
          trending.loadingMore && !searchResults ? (
            <FooterLoading>
              <ActivityIndicator color={colors.primary} />
            </FooterLoading>
          ) : null
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        refreshControl={
          !searchResults && segment === "trending" ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          ) : undefined
        }
      />

      {items.length > 0 && !searchResults ? (
        <DiceButton onPress={handleRoll}>
          <MaterialIcons name="casino" size={22} color="#06283d" />
          <DiceButtonText>O que assistir?</DiceButtonText>
        </DiceButton>
      ) : null}

      <Modal
        visible={Boolean(roulette)}
        transparent
        animationType="fade"
        onRequestClose={() => setRoulette(null)}
      >
        <ModalOverlay onPress={() => setRoulette(null)}>
          <ModalCard onPress={() => {}}>
            <ModalTitle>Sorteio da roleta</ModalTitle>
            <ModalText style={{ marginBottom: 14 }}>
              Que tal assistir agora?
            </ModalText>

            {roulettePoster ? (
              <DetailPoster source={{ uri: roulettePoster }} />
            ) : (
              <PosterFallback>
                <MaterialIcons name="movie" size={28} color={colors.textMuted} />
              </PosterFallback>
            )}

            <ModalTitle style={{ marginTop: 12 }}>{roulette?.title}</ModalTitle>

            <StatusTag>
              <StatusDot />
              <StatusText>{roulette?.statusLabel || "Salvo na sua lista"}</StatusText>
            </StatusTag>

            <RatingBadge $score={roulette?.voteAverage || 0} style={{ marginTop: 10 }}>
              <RatingText>{formatVote(roulette?.voteAverage || 0)}</RatingText>
            </RatingBadge>

            <PrimaryButton
              onPress={() => {
                const card = roulette;
                setRoulette(null);
                navigation.navigate("details", { card });
              }}
            >
              <PrimaryButtonText>Ver mais detalhes</PrimaryButtonText>
            </PrimaryButton>

            <OutlineButton onPress={handleRoll}>
              <OutlineButtonText>Sortear de novo</OutlineButtonText>
            </OutlineButton>

            <MutedText style={{ marginTop: 12 }}>
              Toque fora do quadro para fechar.
            </MutedText>
          </ModalCard>
        </ModalOverlay>
      </Modal>
    </Screen>
  );
};

export default Main;
