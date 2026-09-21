import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { cardKey } from "../utils/format";

/**
 * Guarda os "cards" que o usuário adicionou (a lista dele).
 * Tudo é persistido no AsyncStorage, então os cards continuam lá
 * depois de fechar e abrir o app novamente.
 */

const STORAGE_KEY = "library";

const LibraryContext = createContext(null);

export const LibraryProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  // Carrega a biblioteca salva ao abrir o app.
  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (active && saved) setItems(JSON.parse(saved));
      })
      .catch(() => {})
      .finally(() => {
        if (active) setReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  // Sempre que a lista muda, salva (mesma ideia do componentDidUpdate do GitViewer).
  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => {});
  }, [items, ready]);

  /**
   * Adiciona um card. Retorna false quando ele já estava na lista.
   * A verificação usa a lista atual (closure) para o retorno ser síncrono
   * e confiável, já que o React não executa o updater do setState na hora.
   */
  const addItem = useCallback(
    (card) => {
      if (items.some((item) => cardKey(item) === cardKey(card))) return false;

      setItems((current) => [
        { ...card, category: card.category || "watchlist", addedAt: Date.now() },
        ...current,
      ]);

      return true;
    },
    [items],
  );

  const removeItem = useCallback((key) => {
    setItems((current) => current.filter((item) => cardKey(item) !== key));
  }, []);

  const updateItem = useCallback((key, changes) => {
    setItems((current) =>
      current.map((item) =>
        cardKey(item) === key ? { ...item, ...changes } : item,
      ),
    );
  }, []);

  const setCategory = useCallback(
    (key, category) => updateItem(key, { category }),
    [updateItem],
  );

  const rateItem = useCallback(
    (key, userRating) => updateItem(key, { userRating }),
    [updateItem],
  );

  const clearLibrary = useCallback(() => setItems([]), []);

  const isInLibrary = useCallback(
    (key) => items.some((item) => cardKey(item) === key),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      ready,
      addItem,
      removeItem,
      updateItem,
      setCategory,
      rateItem,
      clearLibrary,
      isInLibrary,
    }),
    [
      items,
      ready,
      addItem,
      removeItem,
      updateItem,
      setCategory,
      rateItem,
      clearLibrary,
      isInLibrary,
    ],
  );

  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary precisa estar dentro de <LibraryProvider>.");
  }
  return context;
};

export default LibraryContext;
