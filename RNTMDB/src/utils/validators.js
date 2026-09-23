/**
 * Validações e máscaras do formulário de cadastro.
 * São funções puras, fáceis de testar e de reaproveitar em outras telas.
 */

/** Remove tudo que não for dígito. */
export const apenasDigitos = (valor = "") => String(valor).replace(/\D/g, "");

/** "16999998888" -> "(16) 99999-8888" | "1633334444" -> "(16) 3333-4444" */
export const mascararTelefone = (valor = "") => {
  const digitos = apenasDigitos(valor).slice(0, 11);
  if (digitos.length <= 2) return digitos.length ? `(${digitos}` : "";
  if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  if (digitos.length <= 10)
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
};

/** Telefone válido: DDD entre 11 e 99 e, em celulares, o nono dígito "9". */
export const telefoneValido = (valor = "") => {
  const digitos = apenasDigitos(valor);
  if (digitos.length !== 10 && digitos.length !== 11) return false;

  const ddd = Number(digitos.slice(0, 2));
  if (ddd < 11 || ddd > 99) return false;

  if (digitos.length === 11) return digitos[2] === "9";
  return true;
};

/** "12345678909" -> "123.456.789-09" */
export const mascararCpf = (valor = "") => {
  const digitos = apenasDigitos(valor).slice(0, 11);
  if (digitos.length <= 3) return digitos;
  if (digitos.length <= 6) return `${digitos.slice(0, 3)}.${digitos.slice(3)}`;
  if (digitos.length <= 9)
    return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6)}`;
  return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9)}`;
};

/**
 * Validação completa de CPF com os dois dígitos verificadores.
 */
export const cpfValido = (valor = "") => {
  const digitos = apenasDigitos(valor);
  if (digitos.length !== 11) return false;

  // Sequências repetidas (111.111.111-11) passam na conta, mas não são válidas.
  if (/^(\d)\1{10}$/.test(digitos)) return false;

  const calcularDigito = (numeros) => {
    let soma = 0;
    for (let i = 0; i < numeros.length; i += 1) {
      soma += Number(numeros[i]) * (numeros.length + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const primeiroDigito = calcularDigito(digitos.slice(0, 9));
  const segundoDigito = calcularDigito(digitos.slice(0, 10));

  return (
    primeiroDigito === Number(digitos[9]) && segundoDigito === Number(digitos[10])
  );
};

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const emailValido = (valor = "") => REGEX_EMAIL.test(valor.trim());
