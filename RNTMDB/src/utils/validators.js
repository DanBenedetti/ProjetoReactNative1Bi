/**
 * Validações e máscaras do formulário de cadastro.
 * São funções puras, fáceis de testar e de reaproveitar em outras telas.
 */

/** Remove tudo que não for dígito. */
export const onlyDigits = (value = "") => String(value).replace(/\D/g, "");

/** "16999998888" -> "(16) 99999-8888" | "1633334444" -> "(16) 3333-4444" */
export const maskPhone = (value = "") => {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

/** Telefone válido: DDD entre 11 e 99 e, em celulares, o nono dígito "9". */
export const isValidPhone = (value = "") => {
  const digits = onlyDigits(value);
  if (digits.length !== 10 && digits.length !== 11) return false;

  const ddd = Number(digits.slice(0, 2));
  if (ddd < 11 || ddd > 99) return false;

  if (digits.length === 11) return digits[2] === "9";
  return true;
};

/** "12345678909" -> "123.456.789-09" */
export const maskCPF = (value = "") => {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

/**
 * Validação completa de CPF com os dois dígitos verificadores.
 */
export const isValidCPF = (value = "") => {
  const digits = onlyDigits(value);
  if (digits.length !== 11) return false;

  // Sequências repetidas (111.111.111-11) passam na conta, mas não são válidas.
  if (/^(\d)\1{10}$/.test(digits)) return false;

  const calculateDigit = (slice) => {
    let sum = 0;
    for (let i = 0; i < slice.length; i += 1) {
      sum += Number(slice[i]) * (slice.length + 1 - i);
    }
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const firstDigit = calculateDigit(digits.slice(0, 9));
  const secondDigit = calculateDigit(digits.slice(0, 10));

  return (
    firstDigit === Number(digits[9]) && secondDigit === Number(digits[10])
  );
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isValidEmail = (value = "") => EMAIL_REGEX.test(value.trim());
