import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { chaveDoCartao } from "../utils/format";

/**
 * Guarda os "cards" que o usuário adicionou (a lista dele).
 * Tudo é persistido no AsyncStorage, então os cards continuam lá
 * depois de fechar e abrir o app novamente.
 */
const CHAVE_ARMAZENAMENTO = "library";

const ContextoBiblioteca = createContext(null);

export const ProvedorBiblioteca = ({ children }) => {
  const [itens, definirItens] = useState([]);
  const [pronto, definirPronto] = useState(false);

  // Carrega a biblioteca salva ao abrir o app.
  useEffect(() => {
    let ativo = true;

    AsyncStorage.getItem(CHAVE_ARMAZENAMENTO)
      .then((salvos) => {
        if (ativo && salvos) definirItens(JSON.parse(salvos));
      })
      .catch(() => {})
      .finally(() => {
        if (ativo) definirPronto(true);
      });

    return () => {
      ativo = false;
    };
  }, []);

  // Sempre que a lista muda, salva (mesma ideia do componentDidUpdate do GitViewer).
  useEffect(() => {
    if (!pronto) return;
    AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(itens)).catch(
      () => {},
    );
  }, [itens, pronto]);

  /**
   * Adiciona um card. Retorna false quando ele já estava na lista.
   */
  const adicionarItem = useCallback(
    (cartao) => {
      if (itens.some((item) => chaveDoCartao(item) === chaveDoCartao(cartao))) {
        return false;
      }

      definirItens((atual) => [
        {
          ...cartao,
          category: cartao.category || "watchlist",
          addedAt: Date.now(),
        },
        ...atual,
      ]);

      return true;
    },
    [itens],
  );

  const removerItem = useCallback((chave) => {
    definirItens((atual) => atual.filter((item) => chaveDoCartao(item) !== chave));
  }, []);

  const atualizarItem = useCallback((chave, mudancas) => {
    definirItens((atual) =>
      atual.map((item) =>
        chaveDoCartao(item) === chave ? { ...item, ...mudancas } : item,
      ),
    );
  }, []);

  const definirCategoria = useCallback(
    (chave, categoria) => atualizarItem(chave, { category: categoria }),
    [atualizarItem],
  );

  const avaliarItem = useCallback(
    (chave, notaDoUsuario) => atualizarItem(chave, { userRating: notaDoUsuario }),
    [atualizarItem],
  );

  const limparBiblioteca = useCallback(() => definirItens([]), []);

  const estaNaBiblioteca = useCallback(
    (chave) => itens.some((item) => chaveDoCartao(item) === chave),
    [itens],
  );

  const valor = useMemo(
    () => ({
      itens,
      pronto,
      adicionarItem,
      removerItem,
      atualizarItem,
      definirCategoria,
      avaliarItem,
      limparBiblioteca,
      estaNaBiblioteca,
    }),
    [
      itens,
      pronto,
      adicionarItem,
      removerItem,
      atualizarItem,
      definirCategoria,
      avaliarItem,
      limparBiblioteca,
      estaNaBiblioteca,
    ],
  );

  return (
    <ContextoBiblioteca.Provider value={valor}>
      {children}
    </ContextoBiblioteca.Provider>
  );
};

export const useBiblioteca = () => {
  const contexto = useContext(ContextoBiblioteca);
  if (!contexto) {
    throw new Error(
      "useBiblioteca precisa estar dentro de <ProvedorBiblioteca>.",
    );
  }
  return contexto;
};

export default ContextoBiblioteca;
