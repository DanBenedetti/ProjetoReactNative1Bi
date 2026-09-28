import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import {
  AnoSimilar,
  BotaoEstrela,
  BotaoPilula,
  CaixaBanner,
  CaixaCarregando,
  CaixaInformacao,
  CardAtor,
  CardSimilar,
  CorpoDetalhes,
  Etiqueta,
  EtiquetaTipo,
  FotoAtor,
  GradeInformacoes,
  ImagemBanner,
  InfoTopoDetalhes,
  LinhaAcoes,
  LinhaEstrelas,
  LinhaEtiquetas,
  ListaElenco,
  ListaSimilares,
  NomeAtor,
  NomeSimilar,
  PapelAtor,
  PosterAlternativo,
  PosterDetalhes,
  PosterSimilar,
  ResumoDetalhes,
  RolagemDetalhes,
  RotuloInformacao,
  Sinopse,
  TextoBotaoPilula,
  TextoEtiqueta,
  TextoEtiquetaTipo,
  TextoSuave,
  TituloBloco,
  TituloDetalhes,
  TopoDetalhes,
  ValorInformacao,
} from "../styles";
import { buscarDetalhes } from "../services/api";
import { temChaveApi } from "../config/tmdb";
import { useBiblioteca } from "../contexts/LibraryContext";
import { useTema } from "../contexts/ThemeContext";
import {
  CATEGORIAS,
  CHAVES_CATEGORIAS,
  chaveDoCartao,
  formatarAno,
  formatarData,
  formatarDinheiro,
  formatarDuracao,
  formatarNota,
  formatarNumero,
  normalizarDetalhes,
  normalizarResultadoBusca,
  pluralizarEpisodios,
  pluralizarTemporadas,
  urlBanner,
  urlPerfil,
  urlPoster,
} from "../utils/format";

/**
 * Tela 4 - MAIS DETALHES DOS CARDS
 *
 * Recebe o card escolhido, busca os detalhes completos no TMDb
 * (sinopse, elenco e similares) e permite gerenciar o título
 * dentro da lista do usuário.
 */
const MAX_ESTRELAS = 5;

const Detalhes = ({ navigation, route }) => {
  const { cartao: cartaoInicial } = route.params;
  const { cores } = useTema();
  const {
    itens,
    adicionarItem,
    removerItem,
    definirCategoria,
    avaliarItem,
    estaNaBiblioteca,
  } = useBiblioteca();

  const [cartao, definirCartao] = useState(cartaoInicial);
  const [dadosCompletos, definirDadosCompletos] = useState(null);
  const [carregando, definirCarregando] = useState(true);

  const chave = chaveDoCartao(cartao);
  const naBiblioteca = estaNaBiblioteca(chave);
  const cartaoSalvo = itens.find((item) => chaveDoCartao(item) === chave);

  // Completa o card com os dados detalhados da API.
  useEffect(() => {
    let ativo = true;

    if (!temChaveApi()) {
      definirCarregando(false);
      return undefined;
    }

    definirCarregando(true);

    buscarDetalhes(cartaoInicial.mediaType, cartaoInicial.id)
      .then((resposta) => {
        if (!ativo) return;
        definirDadosCompletos(resposta.data);
        definirCartao((atual) => ({
          ...atual,
          ...normalizarDetalhes(cartaoInicial.mediaType, resposta.data),
        }));
      })
      .catch((erro) => {
        if (ativo) {
          Alert.alert(
            "Erro ao carregar detalhes",
            erro.friendlyMessage || "Tente novamente mais tarde.",
          );
        }
      })
      .finally(() => {
        if (ativo) definirCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [cartaoInicial.mediaType, cartaoInicial.id]);

  useEffect(() => {
    navigation.setOptions({ title: cartao.title });
  }, [navigation, cartao.title]);

  const elenco = dadosCompletos?.credits?.cast?.slice(0, 20) || [];

  const similares = useMemo(
    () =>
      (dadosCompletos?.similar?.results || [])
        .filter((item) => item.poster_path)
        .slice(0, 12),
    [dadosCompletos],
  );

  const itensInformacao = useMemo(
    () =>
      [
        {
          rotulo: "Nota TMDb",
          valor: cartao.voteCount
            ? `${formatarNota(cartao.voteAverage)} / 10`
            : null,
        },
        { rotulo: "Status", valor: cartao.statusLabel },
        { rotulo: "Lançamento", valor: formatarData(cartao.releaseDate) },
        {
          rotulo: "Duração",
          valor: cartao.runtime ? formatarDuracao(cartao.runtime) : null,
        },
        {
          rotulo: "Temporadas",
          valor: cartao.seasons ? pluralizarTemporadas(cartao.seasons) : null,
        },
        {
          rotulo: "Episódios",
          valor: cartao.episodes ? pluralizarEpisodios(cartao.episodes) : null,
        },
        {
          rotulo: "Votos",
          valor: cartao.voteCount ? formatarNumero(cartao.voteCount) : null,
        },
        { rotulo: "Orçamento", valor: formatarDinheiro(cartao.budget) },
        { rotulo: "Receita", valor: formatarDinheiro(cartao.revenue) },
      ].filter((item) => item.valor),
    [cartao],
  );

  const poster = urlPoster(cartao.posterPath);
  const banner = urlBanner(cartao.backdropPath);
  const nota = cartaoSalvo?.userRating || 0;

  /* ---------------------------------------------------------------- *
   * Ações
   * ---------------------------------------------------------------- */

  const adicionarALista = () => {
    const adicionado = adicionarItem(cartao);
    if (adicionado) {
      Alert.alert(
        "Adicionado!",
        `"${cartao.title}" entrou em "${CATEGORIAS.watchlist}".`,
      );
    } else {
      Alert.alert("Já está na lista", `"${cartao.title}" já foi adicionado.`);
    }
  };

  const remover = () => {
    Alert.alert("Excluir card", `Remover "${cartao.title}" da sua lista?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          removerItem(chave);
          navigation.goBack();
        },
      },
    ]);
  };

  const avaliar = (estrelas) => {
    if (!naBiblioteca) {
      Alert.alert(
        "Adicione o título primeiro",
        "Toque em ADICIONAR À MINHA LISTA para poder dar a sua nota.",
      );
      return;
    }
    avaliarItem(chave, nota === estrelas ? 0 : estrelas);
  };

  const abrirSimilar = (item) =>
    navigation.push("detalhes", {
      cartao: normalizarResultadoBusca({ ...item, media_type: cartao.mediaType }),
    });

  /* ---------------------------------------------------------------- *
   * Renderização
   * ---------------------------------------------------------------- */

  return (
    <RolagemDetalhes>
      <CaixaBanner>
        {banner ? <ImagemBanner source={{ uri: banner }} /> : <View style={{ flex: 1 }} />}
      </CaixaBanner>

      <CorpoDetalhes>
        <TopoDetalhes>
          {poster ? (
            <PosterDetalhes source={{ uri: poster }} />
          ) : (
            <PosterAlternativo>
              <MaterialIcons name="movie" size={28} color={cores.textoSuave} />
            </PosterAlternativo>
          )}

          <InfoTopoDetalhes>
            <EtiquetaTipo>
              <TextoEtiquetaTipo>
                {cartao.mediaType === "tv" ? "Série" : "Filme"}
              </TextoEtiquetaTipo>
            </EtiquetaTipo>
            <TituloDetalhes>{cartao.title}</TituloDetalhes>
            <ResumoDetalhes>
              {cartao.year}
              {cartao.statusLabel ? ` • ${cartao.statusLabel}` : ""}
            </ResumoDetalhes>
          </InfoTopoDetalhes>
        </TopoDetalhes>

        {carregando ? (
          <CaixaCarregando>
            <ActivityIndicator color={cores.primaria} />
            <TextoSuave style={{ marginTop: 10 }}>
              Buscando detalhes no TMDb...
            </TextoSuave>
          </CaixaCarregando>
        ) : null}

        {cartao.genres?.length ? (
          <LinhaEtiquetas>
            {cartao.genres.map((genero) => (
              <Etiqueta key={genero.id}>
                <TextoEtiqueta>{genero.name}</TextoEtiqueta>
              </Etiqueta>
            ))}
          </LinhaEtiquetas>
        ) : null}

        {cartao.overview ? (
          <>
            <TituloBloco>Sinopse</TituloBloco>
            <Sinopse>{cartao.overview}</Sinopse>
          </>
        ) : null}

        {/* Informações completas do requisito "mais detalhes" */}
        <TituloBloco>Informações</TituloBloco>
        <GradeInformacoes>
          {itensInformacao.map((item) => (
            <CaixaInformacao key={item.rotulo}>
              <RotuloInformacao>{item.rotulo}</RotuloInformacao>
              <ValorInformacao>{item.valor}</ValorInformacao>
            </CaixaInformacao>
          ))}
        </GradeInformacoes>

        {/* Minha avaliação (nota pessoal de 1 a 5 estrelas) */}
        <TituloBloco>Minha avaliação</TituloBloco>
        <LinhaEstrelas>
          {Array.from({ length: MAX_ESTRELAS }).map((_, indice) => {
            const valor = indice + 1;
            return (
              <BotaoEstrela key={valor} onPress={() => avaliar(valor)}>
                <MaterialIcons
                  name={valor <= nota ? "star" : "star-border"}
                  size={28}
                  color={valor <= nota ? cores.notaMedia : cores.textoSuave}
                />
              </BotaoEstrela>
            );
          })}
        </LinhaEstrelas>

        {/* Ações */}
        <LinhaAcoes>
          {!naBiblioteca ? (
            <BotaoPilula $ativo onPress={adicionarALista}>
              <MaterialIcons name="add-circle-outline" size={16} color="#06283d" />
              <TextoBotaoPilula $ativo>Adicionar à minha lista</TextoBotaoPilula>
            </BotaoPilula>
          ) : null}
        </LinhaAcoes>

        {/* Troca de categoria do card salvo */}
        {naBiblioteca ? (
          <>
            <TituloBloco>Onde este título está salvo</TituloBloco>
            <LinhaAcoes>
              {CHAVES_CATEGORIAS.map((categoria) => (
                <BotaoPilula
                  key={categoria}
                  $ativo={cartaoSalvo?.category === categoria}
                  onPress={() => definirCategoria(chave, categoria)}
                >
                  <TextoBotaoPilula $ativo={cartaoSalvo?.category === categoria}>
                    {CATEGORIAS[categoria]}
                  </TextoBotaoPilula>
                </BotaoPilula>
              ))}

              <BotaoPilula $variante="perigo" onPress={remover}>
                <MaterialIcons name="delete-outline" size={16} color="#FFFFFF" />
                <TextoBotaoPilula $variante="perigo">Excluir</TextoBotaoPilula>
              </BotaoPilula>
            </LinhaAcoes>
          </>
        ) : null}

        {/* Elenco principal */}
        {elenco.length > 0 ? (
          <>
            <TituloBloco>Elenco principal</TituloBloco>
            <ListaElenco
              data={elenco}
              keyExtractor={(membro) => String(membro.id)}
              renderItem={({ item: membro }) => {
                const avatar = urlPerfil(membro.profile_path);
                return (
                  <CardAtor>
                    {avatar ? (
                      <FotoAtor source={{ uri: avatar }} />
                    ) : (
                      <PosterAlternativo
                        style={{ width: 68, height: 68, borderRadius: 34 }}
                      >
                        <MaterialIcons
                          name="person-outline"
                          size={26}
                          color={cores.textoSuave}
                        />
                      </PosterAlternativo>
                    )}
                    <NomeAtor>{membro.name}</NomeAtor>
                    <PapelAtor>{membro.character}</PapelAtor>
                  </CardAtor>
                );
              }}
            />
          </>
        ) : null}

        {/* Títulos similares: tocar abre os detalhes desse outro título */}
        {similares.length > 0 ? (
          <>
            <TituloBloco>Quem viu, também gostou</TituloBloco>
            <ListaSimilares
              data={similares}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <CardSimilar onPress={() => abrirSimilar(item)}>
                  <PosterSimilar source={{ uri: urlPoster(item.poster_path) }} />
                  <NomeSimilar>{item.title || item.name}</NomeSimilar>
                  <AnoSimilar>
                    {formatarAno(item.release_date || item.first_air_date)} • nota{" "}
                    {formatarNota(item.vote_average)}
                  </AnoSimilar>
                </CardSimilar>
              )}
            />
          </>
        ) : null}
      </CorpoDetalhes>
    </RolagemDetalhes>
  );
};

export default Detalhes;
