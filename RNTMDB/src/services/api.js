import axios from "axios";

import {
  TMDB_CHAVE_API,
  TMDB_IDIOMA,
  TMDB_URL_BASE,
  temChaveApi,
} from "../config/tmdb";

/**
 * Instância única do axios usada por todas as telas (mesmo padrão do
 * projeto GitViewer). Todos os endpoints do TMDb recebem automaticamente
 * a api_key e o idioma pt-BR.
 */
const api = axios.create({
  baseURL: TMDB_URL_BASE,
  timeout: 20000,
});

api.interceptors.request.use((configuracao) => {
  configuracao.params = {
    api_key: TMDB_CHAVE_API,
    language: TMDB_IDIOMA,
    ...configuracao.params,
  };
  return configuracao;
});

api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    // Converte os erros do axios em mensagens que fazem sentido para o usuário.
    let mensagem = "Não foi possível falar com o TMDB. Verifique sua internet.";

    if (!temChaveApi()) {
      mensagem =
        "API Key não configurada. Abra o arquivo .env, cole a sua chave do TMDB e reinicie o app.";
    } else if (erro.response?.status === 401) {
      mensagem = "API Key inválida ou expirada. Confira a chave no arquivo .env.";
    } else if (erro.response?.status === 404) {
      mensagem = "Conteúdo não encontrado no TMDB.";
    } else if (erro.code === "ECONNABORTED") {
      mensagem = "O TMDB demorou demais para responder. Tente novamente.";
    }

    erro.friendlyMessage = mensagem;
    return Promise.reject(erro);
  },
);

/** Destaques da semana (filmes e séries) usados no feed inicial. */
export const buscarDestaques = (pagina = 1) =>
  api.get("/trending/all/week", { params: { page: pagina } });

/** Busca por filmes e séries ao mesmo tempo. */
export const buscarTitulos = (termo, pagina = 1) =>
  api.get("/search/multi", {
    params: { query: termo, page: pagina, include_adult: false },
  });

/**
 * Detalhes completos de um filme/série. "append_to_response" evita três
 * requisições separadas trazendo elenco, vídeos e títulos similares de uma vez.
 */
export const buscarDetalhes = (mediaType, id) =>
  api.get(`/${mediaType}/${id}`, {
    params: { append_to_response: "credits,videos,similar" },
  });

export default api;
