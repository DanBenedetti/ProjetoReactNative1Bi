import { TAMANHOS_IMAGEM, TMDB_URL_BASE_IMAGENS } from "../config/tmdb";

/* ------------------------------------------------------------------ *
 * Imagens
 * ------------------------------------------------------------------ */

/** Monta a URL completa de uma imagem a partir do caminho devolvido pela API. */
export const urlImagem = (caminho, tamanho) =>
  caminho ? `${TMDB_URL_BASE_IMAGENS}/${tamanho}${caminho}` : null;

export const urlPoster = (caminho) => urlImagem(caminho, TAMANHOS_IMAGEM.poster);
export const urlBanner = (caminho) => urlImagem(caminho, TAMANHOS_IMAGEM.backdrop);
export const urlPerfil = (caminho) => urlImagem(caminho, TAMANHOS_IMAGEM.profile);

/* ------------------------------------------------------------------ *
 * Categorias da biblioteca do usuário
 * ------------------------------------------------------------------ */

/**
 * Rótulos exibidos na tela. As chaves (watchlist, watched, favorite) são as
 * mesmas gravadas no aparelho, por isso não mudam.
 */
export const CATEGORIAS = {
  watchlist: "Quero assistir",
  watched: "Assistidos",
  favorite: "Favoritos",
};

export const CHAVES_CATEGORIAS = Object.keys(CATEGORIAS);

/* ------------------------------------------------------------------ *
 * Textos
 * ------------------------------------------------------------------ */

/**
 * O TMDb devolve o campo "status" em inglês em algumas respostas.
 * Mantemos um dicionário para exibir o requisito "status" do card em português.
 * As chaves são os valores exatos que a API devolve, por isso ficam em inglês.
 */
const ROTULOS_STATUS = {
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

export const traduzirStatus = (status) =>
  ROTULOS_STATUS[status] || status || "Status desconhecido";

/** 135 -> "2h 15min" | 45 -> "45min" */
export const formatarDuracao = (minutos) => {
  if (!minutos) return null;
  const horas = Math.floor(minutos / 60);
  const restante = minutos % 60;
  if (!horas) return `${restante}min`;
  return restante ? `${horas}h ${restante}min` : `${horas}h`;
};

/** "2024-05-01" -> "01/05/2024" */
export const formatarData = (data) => {
  if (!data) return null;
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
};

/** "2024-05-01" -> "2024" */
export const formatarAno = (data) => (data ? data.slice(0, 4) : "—");

/** 7.532 -> "7,5" (padrão brasileiro) */
export const formatarNota = (nota) =>
  typeof nota === "number" && nota > 0
    ? nota.toFixed(1).replace(".", ",")
    : "—";

/** 1500000 -> "1.500.000" (sem depender do Intl, que varia entre plataformas) */
export const formatarNumero = (valor) =>
  typeof valor === "number" && valor > 0
    ? String(valor).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    : null;

export const formatarDinheiro = (valor) => {
  const formatado = formatarNumero(valor);
  return formatado ? `US$ ${formatado}` : null;
};

/** 3 -> "3 temporadas" | 1 -> "1 temporada" */
export const pluralizarTemporadas = (total) =>
  `${total} ${total === 1 ? "temporada" : "temporadas"}`;

export const pluralizarEpisodios = (total) =>
  `${total} ${total === 1 ? "episódio" : "episódios"}`;

/** Junta os nomes dos gêneros em uma linha: "Ação • Drama" */
export const juntarGeneros = (generos = []) =>
  generos.map((genero) => genero.name).join(" • ");

/* ------------------------------------------------------------------ *
 * Normalização das respostas do TMDb
 * ------------------------------------------------------------------ */

/**
 * Converte um item de busca/trending no formato interno do app.
 * Os nomes dos campos (posterPath, voteAverage...) seguem os da API do TMDb,
 * o que facilita comparar o código com a documentação.
 * Esses endpoints não trazem "status" nem "gêneros", por isso o card só
 * fica completo depois de buscar os detalhes ao adicionar.
 */
export const normalizarResultadoBusca = (item) => {
  const mediaType = item.media_type || item.mediaType || "movie";
  const data = item.release_date || item.first_air_date;

  return {
    id: item.id,
    mediaType,
    title: item.title || item.name || "Sem título",
    overview: item.overview || "",
    posterPath: item.poster_path,
    backdropPath: item.backdrop_path,
    releaseDate: data,
    year: formatarAno(data),
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
export const normalizarDetalhes = (mediaType, dados) => ({
  id: dados.id,
  mediaType,
  title: dados.title || dados.name || "Sem título",
  overview: dados.overview || "",
  posterPath: dados.poster_path,
  backdropPath: dados.backdrop_path,
  releaseDate: dados.release_date || dados.first_air_date,
  year: formatarAno(dados.release_date || dados.first_air_date),
  voteAverage: dados.vote_average || 0,
  voteCount: dados.vote_count || 0,
  status: dados.status || null,
  statusLabel: traduzirStatus(dados.status),
  genres: dados.genres || [],
  runtime: dados.runtime || null,
  seasons: dados.number_of_seasons || null,
  episodes: dados.number_of_episodes || null,
  budget: dados.budget || 0,
  revenue: dados.revenue || 0,
});

/** Chave única de um título, usada como key do FlatList e como id no AsyncStorage. */
export const chaveDoCartao = (item) => `${item.mediaType}-${item.id}`;

/**
 * Junta duas listas de cards descartando os títulos repetidos.
 *
 * É necessário porque a paginação do TMDb não garante páginas sem repetição:
 * o /trending/all/week, por exemplo, devolve o mesmo filme na página 1 e na 2.
 * Como a chave do FlatList é o "mediaType-id", repetir um título geraria a
 * chave duplicada e o React reclamaria do card duplicado na lista.
 */
export const juntarSemRepetir = (atuais = [], novos = []) => {
  const jaNaLista = new Set(atuais.map(chaveDoCartao));
  return [...atuais, ...novos.filter((item) => !jaNaLista.has(chaveDoCartao(item)))];
};

/** Linha de destaque do card: "2024 • 2h 15min" / "2021 • 3 temporadas". */
export const montarSubtitulo = (item) => {
  const partes = [];
  if (item.year && item.year !== "—") partes.push(item.year);
  if (item.mediaType === "tv" && item.seasons)
    partes.push(pluralizarTemporadas(item.seasons));
  else if (item.runtime) partes.push(formatarDuracao(item.runtime));
  else if (item.mediaType === "tv") partes.push("Série");
  else partes.push("Filme");
  return partes.join(" • ");
};
