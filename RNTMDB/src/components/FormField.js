import React from "react";

import { CaixaCampo, CampoEntrada, RotuloCampo, TextoDeErro } from "../styles";

/**
 * Campo de formulário com rótulo e mensagem de erro.
 * Deixa as telas de LOGIN e CADASTRO bem mais enxutas.
 */
const CampoFormulario = ({ rotulo, erro, ...outrasPropriedades }) => (
  <CaixaCampo>
    {rotulo ? <RotuloCampo>{rotulo}</RotuloCampo> : null}
    <CampoEntrada $invalido={Boolean(erro)} {...outrasPropriedades} />
    {erro ? <TextoDeErro>{erro}</TextoDeErro> : null}
  </CaixaCampo>
);

export default CampoFormulario;
