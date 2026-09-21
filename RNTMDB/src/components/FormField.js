import React from "react";

import { ErrorText, FieldLabel, Input, InputWrapper } from "../styles";

/**
 * Campo de formulário com rótulo e mensagem de erro.
 * Deixa as telas de LOGIN e CADASTRO bem mais enxutas.
 */
const FormField = ({ label, error, ...inputProps }) => (
  <InputWrapper>
    {label ? <FieldLabel>{label}</FieldLabel> : null}
    <Input $invalid={Boolean(error)} {...inputProps} />
    {error ? <ErrorText>{error}</ErrorText> : null}
  </InputWrapper>
);

export default FormField;
