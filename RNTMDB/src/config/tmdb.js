/**
 * Configurações de acesso à API do TMDb.
 * Documentação: https://developer.themoviedb.org/docs/getting-started
 *
 * A API Key NÃO fica escrita no código: ela vem do arquivo ".env"
 * (variáveis com prefixo EXPO_PUBLIC_ são lidas pelo Expo em tempo de build).
 * Modelo disponível em ".env.example".
 */

export const TMDB_CHAVE_API = (
  process.env.EXPO_PUBLIC_TMDB_API_KEY || ""
).trim();

export const TMDB_URL_BASE = "https://api.themoviedb.org/3";

/** Base para montar o caminho das imagens retornadas pela API. */
export const TMDB_URL_BASE_IMAGENS = "https://image.tmdb.org/t/p";

export const TAMANHOS_IMAGEM = {
  poster: "w500",
  backdrop: "w780",
  profile: "w185",
};

/** Idioma padrão das respostas (sinopses, títulos e gêneros em português). */
export const TMDB_IDIOMA = "pt-BR";

/** O TMDb só responde corretamente quando a chave está preenchida. */
export const temChaveApi = () =>
  TMDB_CHAVE_API.length > 0 && TMDB_CHAVE_API !== "sua_api_key_aqui";
