import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider as ProvedorTemaEstilizado } from "styled-components/native";

/**
 * Tema "cinema" do app: a paleta escura é inspirada no próprio site do TMDb
 * (azul #032541 no cabeçalho e azul #01B4E4 nos destaques).
 * A escolha do usuário fica salva no AsyncStorage.
 */

const CORES_ESCURAS = {
  fundo: "#0D0D0F",
  superficie: "#1A1A20",
  superficieAlternativa: "#24242C",
  borda: "#31313B",
  texto: "#F5F5F7",
  textoSuave: "#9BA1AC",
  primaria: "#01B4E4",
  destaque: "#90CEA1",
  perigo: "#E50914",
  cabecalho: "#032541",
  textoCabecalho: "#FFFFFF",
  notaBoa: "#21D07A",
  notaMedia: "#D2D531",
  notaRuim: "#DB2360",
};

const CORES_CLARAS = {
  fundo: "#FFFFFF",
  superficie: "#FFFFFF",
  superficieAlternativa: "#F1F3F6",
  borda: "#DDE1E7",
  texto: "#0D0D0F",
  textoSuave: "#5C6470",
  primaria: "#01B4E4",
  destaque: "#0F8F6B",
  perigo: "#E50914",
  cabecalho: "#032541",
  textoCabecalho: "#FFFFFF",
  notaBoa: "#1FA85F",
  notaMedia: "#C7A800",
  notaRuim: "#DB2360",
};

/* O nome do registro gravado no aparelho continua em inglês: mudar essa string
   faria o app "esquecer" o tema que o usuário já escolheu. */
const CHAVE_ARMAZENAMENTO = "theme";

/* Os valores "dark" e "light" também são os que ficam salvos no aparelho. */
const ESCURO = "dark";
const CLARO = "light";

const ContextoTema = createContext({
  modo: ESCURO,
  temaEscuro: true,
  cores: CORES_ESCURAS,
  alternarTema: () => {},
});

export const ProvedorTema = ({ children }) => {
  const [modo, definirModo] = useState(ESCURO);
  const [pronto, definirPronto] = useState(false);

  // Recupera o tema salvo antes de montar a interface.
  useEffect(() => {
    let ativo = true;

    AsyncStorage.getItem(CHAVE_ARMAZENAMENTO)
      .then((salvo) => {
        if (ativo && (salvo === CLARO || salvo === ESCURO)) {
          definirModo(salvo);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (ativo) definirPronto(true);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const alternarTema = useCallback(() => {
    definirModo((atual) => {
      const proximo = atual === ESCURO ? CLARO : ESCURO;
      AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, proximo).catch(() => {});
      return proximo;
    });
  }, []);

  const cores = modo === ESCURO ? CORES_ESCURAS : CORES_CLARAS;

  const valor = useMemo(
    () => ({ modo, temaEscuro: modo === ESCURO, cores, alternarTema }),
    [modo, cores, alternarTema],
  );

  if (!pronto) return null;

  return (
    <ContextoTema.Provider value={valor}>
      <ProvedorTemaEstilizado theme={{ cores, modo }}>
        {children}
      </ProvedorTemaEstilizado>
    </ContextoTema.Provider>
  );
};

/** Atalho para acessar as cores dentro das telas (ex.: ícones e StatusBar). */
export const useTema = () => useContext(ContextoTema);

export default ContextoTema;
