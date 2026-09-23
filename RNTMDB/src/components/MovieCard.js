import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

import {
  AcoesCartao,
  BotaoPequeno,
  Cartao,
  DicaCategoria,
  EtiquetaStatus,
  InformacoesCartao,
  LinhaTitulo,
  PontoStatus,
  PosterAlternativo,
  PosterCartao,
  ResumoCartao,
  SeloNota,
  TextoBotaoPequeno,
  TextoNota,
  TextoStatus,
  TituloCartao,
} from "../styles";
import {
  CATEGORIAS,
  formatarNota,
  montarSubtitulo,
  urlPoster,
} from "../utils/format";
import { useTema } from "../contexts/ThemeContext";

/**
 * Card de filme/série.
 *
 * O mesmo componente atende dois cenários, apenas com props diferentes:
 *  - Biblioteca:  aoVerDetalhes + aoRemover  (botões VER DETALHES e EXCLUIR)
 *  - API:         aoAdicionar                (botão ADD dos resultados de busca)
 */
const CardDeFilme = ({
  item,
  aoVerDetalhes,
  aoRemover,
  aoAdicionar,
  jaAdicionado = false,
  carregando = false,
}) => {
  const { cores } = useTema();
  const poster = urlPoster(item.posterPath);

  // Os resultados de busca/trending não trazem "status"; nesse caso mostramos
  // o tipo do conteúdo para o card nunca ficar sem essa informação.
  const rotuloStatus =
    item.statusLabel || (item.mediaType === "tv" ? "Série" : "Filme");

  return (
    <Cartao>
      {poster ? (
        <PosterCartao source={{ uri: poster }} />
      ) : (
        <PosterAlternativo>
          <MaterialIcons name="movie" size={28} color={cores.textoSuave} />
        </PosterAlternativo>
      )}

      <InformacoesCartao>
        <LinhaTitulo>
          <TituloCartao>{item.title}</TituloCartao>
          <SeloNota $nota={item.voteAverage}>
            <TextoNota>{formatarNota(item.voteAverage)}</TextoNota>
          </SeloNota>
        </LinhaTitulo>

        <ResumoCartao>{montarSubtitulo(item)}</ResumoCartao>

        <EtiquetaStatus>
          <PontoStatus />
          <TextoStatus>{rotuloStatus}</TextoStatus>
        </EtiquetaStatus>

        {item.category ? (
          <DicaCategoria>{CATEGORIAS[item.category]}</DicaCategoria>
        ) : null}

        <AcoesCartao>
          {aoVerDetalhes ? (
            <BotaoPequeno onPress={aoVerDetalhes}>
              <TextoBotaoPequeno>Ver detalhes</TextoBotaoPequeno>
            </BotaoPequeno>
          ) : null}

          {aoAdicionar && !jaAdicionado ? (
            <BotaoPequeno onPress={aoAdicionar} disabled={carregando}>
              <TextoBotaoPequeno>{carregando ? "..." : "ADD"}</TextoBotaoPequeno>
            </BotaoPequeno>
          ) : null}

          {aoAdicionar && jaAdicionado ? (
            <BotaoPequeno $variante="concluido" disabled>
              <TextoBotaoPequeno $variante="concluido">
                Na lista
              </TextoBotaoPequeno>
            </BotaoPequeno>
          ) : null}

          {aoRemover ? (
            <BotaoPequeno $variante="perigo" onPress={aoRemover}>
              <TextoBotaoPequeno $variante="perigo">Excluir</TextoBotaoPequeno>
            </BotaoPequeno>
          ) : null}
        </AcoesCartao>
      </InformacoesCartao>
    </Cartao>
  );
};

export default CardDeFilme;
