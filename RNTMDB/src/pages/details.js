import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Share,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import {
  ActionRow,
  BackdropImage,
  BlockTitle,
  BackdropWrapper,
  CastAvatar,
  CastCard,
  CastList,
  CastName,
  CastRole,
  Chip,
  ChipRow,
  ChipText,
  DetailBody,
  DetailMeta,
  DetailPoster,
  DetailScroll,
  DetailTitle,
  DetailTop,
  DetailTopInfo,
  InfoBox,
  InfoGrid,
  InfoLabel,
  InfoValue,
  LoadingBox,
  MutedText,
  Overview,
  PillButton,
  PillButtonText,
  PosterFallback,
  SimilarCard,
  SimilarList,
  SimilarName,
  SimilarPoster,
  SimilarYear,
  StarsRow,
  StarButton,
  TypeTag,
  TypeTagText,
} from "../styles";
import { getDetails } from "../services/api";
import { hasApiKey } from "../config/tmdb";
import { useLibrary } from "../contexts/LibraryContext";
import { useTheme } from "../contexts/ThemeContext";
import {
  CATEGORIES,
  CATEGORY_KEYS,
  backdropUrl,
  cardKey,
  formatDate,
  formatMoney,
  formatNumber,
  formatRuntime,
  formatVote,
  formatYear,
  normalizeDetails,
  normalizeSearchResult,
  pluralizeEpisodes,
  pluralizeSeasons,
  posterUrl,
  profileUrl,
} from "../utils/format";

/**
 * Tela 4 - MAIS DETALHES DOS CARDS
 *
 * Recebe o card escolhido, busca os detalhes completos no TMDb
 * (sinopse, elenco, trailer e similares) e permite gerenciar o título
 * dentro da lista do usuário.
 */
const MAX_STARS = 5;

const Details = ({ navigation, route }) => {
  const { card: initialCard } = route.params;
  const { colors } = useTheme();
  const {
    items,
    addItem,
    removeItem,
    setCategory,
    rateItem,
    isInLibrary,
  } = useLibrary();

  const [card, setCard] = useState(initialCard);
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);

  const key = cardKey(card);
  const inLibrary = isInLibrary(key);
  const savedCard = items.find((item) => cardKey(item) === key);

  // Completa o card com os dados detalhados da API.
  useEffect(() => {
    let active = true;

    if (!hasApiKey()) {
      setLoading(false);
      return undefined;
    }

    setLoading(true);

    getDetails(initialCard.mediaType, initialCard.id)
      .then((response) => {
        if (!active) return;
        setPayload(response.data);
        setCard((current) => ({
          ...current,
          ...normalizeDetails(initialCard.mediaType, response.data),
        }));
      })
      .catch((error) => {
        if (active) {
          Alert.alert(
            "Erro ao carregar detalhes",
            error.friendlyMessage || "Tente novamente mais tarde.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [initialCard.mediaType, initialCard.id]);

  useEffect(() => {
    navigation.setOptions({ title: card.title });
  }, [navigation, card.title]);

  const cast = payload?.credits?.cast?.slice(0, 20) || [];

  const trailer = useMemo(() => {
    const videos = payload?.videos?.results || [];
    return (
      videos.find((video) => video.site === "YouTube" && video.type === "Trailer") ||
      videos.find((video) => video.site === "YouTube") ||
      null
    );
  }, [payload]);

  const similar = useMemo(
    () =>
      (payload?.similar?.results || [])
        .filter((item) => item.poster_path)
        .slice(0, 12),
    [payload],
  );

  const infoItems = useMemo(
    () =>
      [
        {
          label: "Nota TMDb",
          value: card.voteCount ? `${formatVote(card.voteAverage)} / 10` : null,
        },
        { label: "Status", value: card.statusLabel },
        { label: "Lançamento", value: formatDate(card.releaseDate) },
        { label: "Duração", value: card.runtime ? formatRuntime(card.runtime) : null },
        {
          label: "Temporadas",
          value: card.seasons ? pluralizeSeasons(card.seasons) : null,
        },
        {
          label: "Episódios",
          value: card.episodes ? pluralizeEpisodes(card.episodes) : null,
        },
        { label: "Votos", value: card.voteCount ? formatNumber(card.voteCount) : null },
        { label: "Orçamento", value: formatMoney(card.budget) },
        { label: "Receita", value: formatMoney(card.revenue) },
      ].filter((item) => item.value),
    [card],
  );

  const poster = posterUrl(card.posterPath);
  const backdrop = backdropUrl(card.backdropPath);
  const rating = savedCard?.userRating || 0;

  /* ---------------------------------------------------------------- *
   * Ações
   * ---------------------------------------------------------------- */

  const handleAddToList = () => {
    const added = addItem(card);
    if (added) Alert.alert("Adicionado!", `"${card.title}" entrou em "${CATEGORIES.watchlist}".`);
    else Alert.alert("Já está na lista", `"${card.title}" já foi adicionado.`);
  };

  const handleRemove = () => {
    Alert.alert("Excluir card", `Remover "${card.title}" da sua lista?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          removeItem(key);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleOpenTrailer = () => {
    if (!trailer) return;
    Linking.openURL(`https://www.youtube.com/watch?v=${trailer.key}`).catch(() =>
      Alert.alert("Erro", "Não foi possível abrir o trailer."),
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${card.title} (${card.year}) — nota ${formatVote(
          card.voteAverage,
        )}/10 no TMDb.${card.overview ? `\n\n${card.overview}` : ""}`,
      });
    } catch {
      // Usuário cancelou o compartilhamento: nada a fazer.
    }
  };

  const handleRate = (stars) => {
    if (!inLibrary) {
      Alert.alert(
        "Adicione o título primeiro",
        "Toque em ADICIONAR À MINHA LISTA para poder dar a sua nota.",
      );
      return;
    }
    rateItem(key, rating === stars ? 0 : stars);
  };

  const openSimilar = (item) =>
    navigation.push("details", {
      card: normalizeSearchResult({ ...item, media_type: card.mediaType }),
    });

  /* ---------------------------------------------------------------- *
   * Renderização
   * ---------------------------------------------------------------- */

  return (
    <DetailScroll>
      <BackdropWrapper>
        {backdrop ? (
          <BackdropImage source={{ uri: backdrop }} />
        ) : (
          <View style={{ flex: 1 }} />
        )}
      </BackdropWrapper>

      <DetailBody>
        <DetailTop>
          {poster ? (
            <DetailPoster source={{ uri: poster }} />
          ) : (
            <PosterFallback>
              <MaterialIcons name="movie" size={28} color={colors.textMuted} />
            </PosterFallback>
          )}

          <DetailTopInfo>
            <TypeTag>
              <TypeTagText>
                {card.mediaType === "tv" ? "Série" : "Filme"}
              </TypeTagText>
            </TypeTag>
            <DetailTitle>{card.title}</DetailTitle>
            <DetailMeta>
              {card.year}
              {card.statusLabel ? ` • ${card.statusLabel}` : ""}
            </DetailMeta>
          </DetailTopInfo>
        </DetailTop>

        {loading ? (
          <LoadingBox>
            <ActivityIndicator color={colors.primary} />
            <MutedText style={{ marginTop: 10 }}>
              Buscando detalhes no TMDb...
            </MutedText>
          </LoadingBox>
        ) : null}

        {card.genres?.length ? (
          <ChipRow>
            {card.genres.map((genre) => (
              <Chip key={genre.id}>
                <ChipText>{genre.name}</ChipText>
              </Chip>
            ))}
          </ChipRow>
        ) : null}

        {card.overview ? (
          <>
            <BlockTitle>Sinopse</BlockTitle>
            <Overview>{card.overview}</Overview>
          </>
        ) : null}

        {/* Informações completas do requisito "mais detalhes" */}
        <BlockTitle>Informações</BlockTitle>
        <InfoGrid>
          {infoItems.map((item) => (
            <InfoBox key={item.label}>
              <InfoLabel>{item.label}</InfoLabel>
              <InfoValue>{item.value}</InfoValue>
            </InfoBox>
          ))}
        </InfoGrid>

        {/* Minha avaliação (nota pessoal de 1 a 5 estrelas) */}
        <BlockTitle>Minha avaliação</BlockTitle>
        <StarsRow>
          {Array.from({ length: MAX_STARS }).map((_, index) => {
            const value = index + 1;
            return (
              <StarButton key={value} onPress={() => handleRate(value)}>
                <MaterialIcons
                  name={value <= rating ? "star" : "star-border"}
                  size={28}
                  color={value <= rating ? colors.ratingMid : colors.textMuted}
                />
              </StarButton>
            );
          })}
        </StarsRow>

        {/* Ações */}
        <ActionRow>
          {trailer ? (
            <PillButton onPress={handleOpenTrailer}>
              <MaterialIcons name="play-circle-outline" size={16} color={colors.text} />
              <PillButtonText>Assistir trailer</PillButtonText>
            </PillButton>
          ) : null}

          <PillButton onPress={handleShare}>
            <MaterialIcons name="share" size={16} color={colors.text} />
            <PillButtonText>Compartilhar</PillButtonText>
          </PillButton>

          {!inLibrary ? (
            <PillButton $active onPress={handleAddToList}>
              <MaterialIcons name="add-circle-outline" size={16} color="#06283d" />
              <PillButtonText $active>Adicionar à minha lista</PillButtonText>
            </PillButton>
          ) : null}
        </ActionRow>

        {/* Troca de categoria do card salvo */}
        {inLibrary ? (
          <>
            <BlockTitle>Onde este título está salvo</BlockTitle>
            <ActionRow>
              {CATEGORY_KEYS.map((category) => (
                <PillButton
                  key={category}
                  $active={savedCard?.category === category}
                  onPress={() => setCategory(key, category)}
                >
                  <PillButtonText $active={savedCard?.category === category}>
                    {CATEGORIES[category]}
                  </PillButtonText>
                </PillButton>
              ))}

              <PillButton $variant="danger" onPress={handleRemove}>
                <MaterialIcons name="delete-outline" size={16} color="#FFFFFF" />
                <PillButtonText $variant="danger">Excluir</PillButtonText>
              </PillButton>
            </ActionRow>
          </>
        ) : null}

        {/* Elenco principal */}
        {cast.length > 0 ? (
          <>
            <BlockTitle>Elenco principal</BlockTitle>
            <CastList
              data={cast}
              keyExtractor={(member) => String(member.id)}
              renderItem={({ item: member }) => {
                const avatar = profileUrl(member.profile_path);
                return (
                  <CastCard>
                    {avatar ? (
                      <CastAvatar source={{ uri: avatar }} />
                    ) : (
                      <PosterFallback
                        style={{ width: 68, height: 68, borderRadius: 34 }}
                      >
                        <MaterialIcons
                          name="person-outline"
                          size={26}
                          color={colors.textMuted}
                        />
                      </PosterFallback>
                    )}
                    <CastName>{member.name}</CastName>
                    <CastRole>{member.character}</CastRole>
                  </CastCard>
                );
              }}
            />
          </>
        ) : null}

        {/* Títulos similares: tocar abre os detalhes desse outro título */}
        {similar.length > 0 ? (
          <>
            <BlockTitle>Quem viu, também gostou</BlockTitle>
            <SimilarList
              data={similar}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <SimilarCard onPress={() => openSimilar(item)}>
                  <SimilarPoster source={{ uri: posterUrl(item.poster_path) }} />
                  <SimilarName>{item.title || item.name}</SimilarName>
                  <SimilarYear>
                    {formatYear(item.release_date || item.first_air_date)} • nota{" "}
                    {formatVote(item.vote_average)}
                  </SimilarYear>
                </SimilarCard>
              )}
            />
          </>
        ) : null}
      </DetailBody>
    </DetailScroll>
  );
};

export default Details;
