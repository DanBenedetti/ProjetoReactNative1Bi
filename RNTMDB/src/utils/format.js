import { IMAGE_SIZES, TMDB_IMAGE_BASE_URL } from "../config/tmdb";

/* ------------------------------------------------------------------ *
 * Imagens
 * ------------------------------------------------------------------ */

/** Monta a URL completa de uma imagem a partir do caminho devolvido pela API. */
export const imageUrl = (path, size) =>
  path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : null;

export const posterUrl = (path) => imageUrl(path, IMAGE_SIZES.poster);
export const backdropUrl = (path) => imageUrl(path, IMAGE_SIZES.backdrop);
export const profileUrl = (path) => imageUrl(path, IMAGE_SIZES.profile);

/* ------------------------------------------------------------------ *
 * Categorias da biblioteca do usuário
 * ------------------------------------------------------------------ */

export const CATEGORIES = {
  watchlist: "Quero assistir",
  watched: "Assistidos",
  favorite: "Favoritos",
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES);

/* ------------------------------------------------------------------ *
 * Textos
 * ------------------------------------------------------------------ */

/**
 * O TMDb devolve o campo "status" em inglês em algumas respostas.
 * Mantemos um dicionário para exibir o requisito "status" do card em português.
 */
const STATUS_LABELS = {
  Released: "Lançado",
  "Post Production": "Em pós-produção",
  "In Production": "Em produção",
  Planned: "Planejado",
  Rumored: "Rumor",
  Canceled: "Cancelado",
  "Returning Series": "Em exibição",
  Ended: "Finalizada",
  Pilot: "Piloto",
};

export const translateStatus = (status) =>
  STATUS_LABELS[status] || status || "Status desconhecido";

/** 135 -> "2h 15min" | 45 -> "45min" */
export const formatRuntime = (minutes) => {
  if (!minutes) return null;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest}min`;
  return rest ? `${hours}h ${rest}min` : `${hours}h`;
};

/** "2024-05-01" -> "01/05/2024" */
export const formatDate = (date) => {
  if (!date) return null;
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

/** "2024-05-01" -> "2024" */
export const formatYear = (date) => (date ? date.slice(0, 4) : "—");

/** 7.532 -> "7,5" (padrão brasileiro) */
export const formatVote = (vote) =>
  typeof vote === "number" && vote > 0 ? vote.toFixed(1).replace(".", ",") : "—";

/** 1500000 -> "1.500.000" (sem depender do Intl, que varia entre plataformas) */
export const formatNumber = (value) =>
  typeof value === "number" && value > 0
    ? String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    : null;

export const formatMoney = (value) => {
  const formatted = formatNumber(value);
  return formatted ? `US$ ${formatted}` : null;
};

/** 3 -> "3 temporadas" | 1 -> "1 temporada" */
export const pluralizeSeasons = (total) =>
  `${total} ${total === 1 ? "temporada" : "temporadas"}`;

export const pluralizeEpisodes = (total) =>
  `${total} ${total === 1 ? "episódio" : "episódios"}`;

/** Junta os nomes dos gêneros em uma linha: "Ação • Drama" */
export const joinGenres = (genres = []) =>
  genres.map((genre) => genre.name).join(" • ");

/* ------------------------------------------------------------------ *
 * Normalização das respostas do TMDb
 * ------------------------------------------------------------------ */

/**
 * Converte um item de busca/trending no formato interno do app.
 * Esses endpoints não trazem "status" nem "gêneros", por isso o card só
 * fica completo depois de buscar os detalhes ao adicionar.
 */
export const normalizeSearchResult = (item) => {
  const mediaType = item.media_type || item.mediaType || "movie";
  const date = item.release_date || item.first_air_date;

  return {
    id: item.id,
    mediaType,
    title: item.title || item.name || "Sem título",
    overview: item.overview || "",
    posterPath: item.poster_path,
    backdropPath: item.backdrop_path,
    releaseDate: date,
    year: formatYear(date),
    voteAverage: item.vote_average || 0,
    voteCount: item.vote_count || 0,
    status: null,
    statusLabel: null,
    genres: [],
    runtime: null,
    seasons: null,
    episodes: null,
    category: null,
    userRating: 0,
    addedAt: null,
  };
};

/** Converte a resposta de /movie/{id} ou /tv/{id} no formato interno. */
export const normalizeDetails = (mediaType, data) => ({
  id: data.id,
  mediaType,
  title: data.title || data.name || "Sem título",
  overview: data.overview || "",
  posterPath: data.poster_path,
  backdropPath: data.backdrop_path,
  releaseDate: data.release_date || data.first_air_date,
  year: formatYear(data.release_date || data.first_air_date),
  voteAverage: data.vote_average || 0,
  voteCount: data.vote_count || 0,
  status: data.status || null,
  statusLabel: translateStatus(data.status),
  genres: data.genres || [],
  runtime: data.runtime || null,
  seasons: data.number_of_seasons || null,
  episodes: data.number_of_episodes || null,
  budget: data.budget || 0,
  revenue: data.revenue || 0,
});

/** Chave única de um título, usada como key do FlatList e como id no AsyncStorage. */
export const cardKey = (item) => `${item.mediaType}-${item.id}`;

/** Linha de destaque do card: "2024 • 2h 15min" / "2021 • 3 temporadas". */
export const buildSubtitle = (item) => {
  const parts = [];
  if (item.year && item.year !== "—") parts.push(item.year);
  if (item.mediaType === "tv" && item.seasons)
    parts.push(pluralizeSeasons(item.seasons));
  else if (item.runtime) parts.push(formatRuntime(item.runtime));
  else if (item.mediaType === "tv") parts.push("Série");
  else parts.push("Filme");
  return parts.join(" • ");
};
