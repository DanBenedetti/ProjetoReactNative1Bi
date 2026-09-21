import axios from "axios";

import {
  TMDB_API_KEY,
  TMDB_BASE_URL,
  TMDB_LANGUAGE,
  hasApiKey,
} from "../config/tmdb";

/**
 * Instância única do axios usada por todas as telas (mesmo padrão do
 * projeto GitViewer). Todos os endpoints do TMDb recebem automaticamente
 * a api_key e o idioma pt-BR.
 */
const api = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  config.params = {
    api_key: TMDB_API_KEY,
    language: TMDB_LANGUAGE,
    ...config.params,
  };
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Converte os erros do axios em mensagens que fazem sentido para o usuário.
    let message = "Não foi possível falar com o TMDB. Verifique sua internet.";

    if (!hasApiKey()) {
      message =
        "API Key não configurada. Abra o arquivo .env, cole a sua chave do TMDB e reinicie o app.";
    } else if (error.response?.status === 401) {
      message = "API Key inválida ou expirada. Confira a chave no arquivo .env.";
    } else if (error.response?.status === 404) {
      message = "Conteúdo não encontrado no TMDB.";
    } else if (error.code === "ECONNABORTED") {
      message = "O TMDB demorou demais para responder. Tente novamente.";
    }

    error.friendlyMessage = message;
    return Promise.reject(error);
  },
);

/** Destaques da semana (filmes e séries) usados no feed inicial. */
export const getTrending = (page = 1) =>
  api.get("/trending/all/week", { params: { page } });

/** Busca por filmes e séries ao mesmo tempo. */
export const searchTitles = (query, page = 1) =>
  api.get("/search/multi", {
    params: { query, page, include_adult: false },
  });

/**
 * Detalhes completos de um filme/série. "append_to_response" evita três
 * requisições separadas trazendo elenco, vídeos e títulos similares de uma vez.
 */
export const getDetails = (mediaType, id) =>
  api.get(`/${mediaType}/${id}`, {
    params: { append_to_response: "credits,videos,similar" },
  });

export default api;
