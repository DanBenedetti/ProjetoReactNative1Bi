import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

import {
  Card,
  CardActions,
  CardInfo,
  CardMeta,
  CardPoster,
  CardTitle,
  CategoryHint,
  PosterFallback,
  RatingBadge,
  RatingText,
  SmallButton,
  SmallButtonText,
  StatusDot,
  StatusTag,
  StatusText,
  TitleRow,
} from "../styles";
import { CATEGORIES, buildSubtitle, formatVote, posterUrl } from "../utils/format";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Card de filme/série.
 *
 * O mesmo componente atende dois cenários, apenas com props diferentes:
 *  - Biblioteca:  onPressDetails + onRemove  (botões VER MAIS DETALHES e EXCLUIR)
 *  - API:         onAdd                     (botão ADD dos resultados de busca)
 */
const MovieCard = ({
  item,
  onPressDetails,
  onRemove,
  onAdd,
  added = false,
  loading = false,
}) => {
  const { colors } = useTheme();
  const poster = posterUrl(item.posterPath);

  // Os resultados de busca/trending não trazem "status"; nesse caso mostramos
  // o tipo do conteúdo para o card nunca ficar sem essa informação.
  const statusLabel =
    item.statusLabel || (item.mediaType === "tv" ? "Série" : "Filme");

  return (
    <Card>
      {poster ? (
        <CardPoster source={{ uri: poster }} />
      ) : (
        <PosterFallback>
          <MaterialIcons name="movie" size={28} color={colors.textMuted} />
        </PosterFallback>
      )}

      <CardInfo>
        <TitleRow>
          <CardTitle>{item.title}</CardTitle>
          <RatingBadge $score={item.voteAverage}>
            <RatingText>{formatVote(item.voteAverage)}</RatingText>
          </RatingBadge>
        </TitleRow>

        <CardMeta>{buildSubtitle(item)}</CardMeta>

        <StatusTag>
          <StatusDot />
          <StatusText>{statusLabel}</StatusText>
        </StatusTag>

        {item.category ? (
          <CategoryHint>{CATEGORIES[item.category]}</CategoryHint>
        ) : null}

        <CardActions>
          {onPressDetails ? (
            <SmallButton onPress={onPressDetails}>
              <SmallButtonText>Ver mais detalhes</SmallButtonText>
            </SmallButton>
          ) : null}

          {onAdd && !added ? (
            <SmallButton onPress={onAdd} disabled={loading}>
              <SmallButtonText>{loading ? "..." : "ADD"}</SmallButtonText>
            </SmallButton>
          ) : null}

          {onAdd && added ? (
            <SmallButton $variant="done" disabled>
              <SmallButtonText $variant="done">Na lista</SmallButtonText>
            </SmallButton>
          ) : null}

          {onRemove ? (
            <SmallButton $variant="danger" onPress={onRemove}>
              <SmallButtonText $variant="danger">Excluir</SmallButtonText>
            </SmallButton>
          ) : null}
        </CardActions>
      </CardInfo>
    </Card>
  );
};

export default MovieCard;
