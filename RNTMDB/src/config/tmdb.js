/**
 * Configurações de acesso à API do TMDb.
 * Documentação: https://developer.themoviedb.org/docs/getting-started
 *
 * A API Key NÃO fica escrita no código: ela vem do arquivo ".env"
 * (variáveis com prefixo EXPO_PUBLIC_ são lidas pelo Expo em tempo de build).
 * Modelo disponível em ".env.example".
 */

export const TMDB_API_KEY = (process.env.EXPO_PUBLIC_TMDB_API_KEY || "").trim();

export const TMDB_BASE_URL = "https://api.themoviedb.org/3";

/** Base para montar o caminho das imagens retornadas pela API. */
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const IMAGE_SIZES = {
  poster: "w500",
  backdrop: "w780",
  profile: "w185",
};

/** Idioma padrão das respostas (sinopses, títulos e gêneros em português). */
export const TMDB_LANGUAGE = "pt-BR";

/** O TMDb só responde corretamente quando a chave está preenchida. */
export const hasApiKey = () =>
  TMDB_API_KEY.length > 0 && TMDB_API_KEY !== "sua_api_key_aqui";
