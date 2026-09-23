import React from "react";

import { Aba, LinhaAbas, TextoAba } from "../styles";

/**
 * Abas da tela de CARDS (Destaques / Quero assistir / Assistidos / Favoritos).
 * Recebe a lista de segmentos e avisa a tela qual foi escolhido.
 */
const AbasSegmento = ({ segmentos, ativo, aoMudar }) => (
  <LinhaAbas>
    {segmentos.map((segmento) => {
      const estaAtivo = ativo === segmento.key;

      return (
        <Aba
          key={segmento.key}
          $ativo={estaAtivo}
          onPress={() => aoMudar(segmento.key)}
        >
          <TextoAba $ativo={estaAtivo}>{segmento.label}</TextoAba>
        </Aba>
      );
    })}
  </LinhaAbas>
);

export default AbasSegmento;
