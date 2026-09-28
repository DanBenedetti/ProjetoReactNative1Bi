import styled from "styled-components/native";
import { RectButton } from "react-native-gesture-handler";

/**
 * Estilos centralizados do app (mesma organização do projeto GitViewer).
 * Todos os componentes leem as cores do tema (theme.cores), então trocar
 * claro/escuro é só chamar alternarTema() no ContextoTema.
 *
 * Props que servem apenas para o estilo começam com "$" e por isso não são
 * repassadas para os componentes nativos.
 */

/* ------------------------------------------------------------------ *
 * Estrutura geral
 * ------------------------------------------------------------------ */

export const Tela = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.cores.fundo};
`;

export const TelaCentralizada = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.cores.fundo};
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

export const TituloSecao = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.cores.texto};
  margin: 24px 20px 12px;
`;

export const TextoSuave = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.cores.textoSuave};
`;

export const TextoDeErro = styled.Text`
  align-self: flex-start;
  font-size: 12px;
  color: ${({ theme }) => theme.cores.perigo};
  margin-top: 4px;
  margin-left: 2px;
`;

/* ------------------------------------------------------------------ *
 * LOGIN e CADASTRO
 * ------------------------------------------------------------------ */

export const ContainerAutenticacao = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.cores.fundo};
  align-items: center;
  justify-content: center;
  padding-horizontal: 28px;
`;

export const LogoMarca = styled.View`
  width: 68px;
  height: 68px;
  border-radius: 34px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.cores.cabecalho};
  margin-bottom: 14px;
`;

export const Marca = styled.Text`
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 2px;
  color: ${({ theme }) => theme.cores.texto};
`;

export const MarcaDestaque = styled.Text`
  color: ${({ theme }) => theme.cores.primaria};
`;

export const MarcaSubtitulo = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.cores.textoSuave};
  margin-top: 6px;
  margin-bottom: 28px;
  text-align: center;
`;

export const CaixaCampo = styled.View`
  width: 100%;
  margin-bottom: 14px;
`;

export const RotuloCampo = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.cores.textoSuave};
  margin-bottom: 6px;
  margin-left: 2px;
`;

export const CampoEntrada = styled.TextInput.attrs({
  placeholderTextColor: "#8A9099",
})`
  width: 100%;
  height: 46px;
  border-radius: 10px;
  padding: 0 14px;
  font-size: 15px;
  border-width: 1px;
  border-color: ${({ theme, $invalido }) =>
    $invalido ? theme.cores.perigo : theme.cores.borda};
  background: ${({ theme }) => theme.cores.superficieAlternativa};
  color: ${({ theme }) => theme.cores.texto};
`;

export const BotaoPrincipal = styled(RectButton)`
  width: 100%;
  height: 50px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.cores.primaria};
  margin-top: 8px;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

export const TextoBotaoPrincipal = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #06283d;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const BotaoContorno = styled(RectButton)`
  width: 100%;
  height: 50px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.cores.primaria};
`;

export const TextoBotaoContorno = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: ${({ theme }) => theme.cores.primaria};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const RolagemFormulario = styled.ScrollView.attrs({
  contentContainerStyle: { paddingBottom: 40 },
  keyboardShouldPersistTaps: "handled",
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
  background: ${({ theme }) => theme.cores.fundo};
`;

export const CorpoFormulario = styled.View`
  padding-horizontal: 24px;
`;

/* ------------------------------------------------------------------ *
 * Tela principal (CARDS)
 * ------------------------------------------------------------------ */

export const LinhaSaudacao = styled.View`
  padding: 16px 20px 8px;
`;

export const Saudacao = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.cores.texto};
`;

export const DicaSaudacao = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.cores.textoSuave};
  margin-top: 2px;
`;

export const LinhaBusca = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 8px 20px 12px;
`;

export const CampoBusca = styled.TextInput.attrs({
  placeholderTextColor: "#8A9099",
})`
  flex: 1;
  height: 44px;
  border-radius: 10px;
  padding: 0 14px;
  font-size: 15px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.cores.borda};
  background: ${({ theme }) => theme.cores.superficieAlternativa};
  color: ${({ theme }) => theme.cores.texto};
`;

export const BotaoBuscar = styled(RectButton)`
  width: 48px;
  height: 44px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  background: ${({ theme }) => theme.cores.primaria};
  opacity: ${({ $carregando }) => ($carregando ? 0.7 : 1)};
`;

export const LinhaAbas = styled.View`
  flex-direction: row;
  padding: 0 12px 8px;
`;

export const Aba = styled(RectButton)`
  flex: 1;
  height: 38px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin-horizontal: 4px;
  background: ${({ theme, $ativo }) =>
    $ativo ? theme.cores.primaria : theme.cores.superficieAlternativa};
`;

export const TextoAba = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme, $ativo }) =>
    $ativo ? "#06283d" : theme.cores.textoSuave};
`;

export const Lista = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: { paddingBottom: 120 },
})`
  flex: 1;
  margin-top: 8px;
`;

/* --- Card ---------------------------------------------------------- */

export const Cartao = styled.View`
  flex-direction: row;
  margin: 0 20px 14px;
  border-radius: 12px;
  padding: 10px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.cores.borda};
  background: ${({ theme }) => theme.cores.superficie};
  /* Elevação do Material Design: aplicada no tema claro e dispensada no escuro,
     seguindo a recomendação do Material (no dark theme a separação é por cor). */
  elevation: ${({ theme }) => (theme.modo === "dark" ? 0 : 2)};
  shadow-color: #0b1220;
  shadow-opacity: ${({ theme }) => (theme.modo === "dark" ? 0 : 0.12)};
  shadow-radius: 8px;
  shadow-offset: 0px 2px;
`;

export const PosterCartao = styled.Image`
  width: 84px;
  height: 126px;
  border-radius: 8px;
  background: ${({ theme }) => theme.cores.superficieAlternativa};
`;

export const PosterAlternativo = styled.View`
  width: 84px;
  height: 126px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.cores.superficieAlternativa};
`;

export const InformacoesCartao = styled.View`
  flex: 1;
  margin-left: 12px;
`;

export const LinhaTitulo = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

export const TituloCartao = styled.Text.attrs({ numberOfLines: 2 })`
  flex: 1;
  margin-right: 8px;
  font-size: 15px;
  font-weight: bold;
  color: ${({ theme }) => theme.cores.texto};
`;

export const ResumoCartao = styled.Text.attrs({ numberOfLines: 1 })`
  font-size: 12px;
  color: ${({ theme }) => theme.cores.textoSuave};
  margin-top: 3px;
`;

export const EtiquetaStatus = styled.View`
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  border-radius: 20px;
  padding: 3px 9px;
  margin-top: 6px;
  background: ${({ theme }) => theme.cores.superficieAlternativa};
`;

export const PontoStatus = styled.View`
  width: 7px;
  height: 7px;
  border-radius: 4px;
  margin-right: 6px;
  background: ${({ theme }) => theme.cores.destaque};
`;

export const TextoStatus = styled.Text`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.cores.texto};
`;

export const SeloNota = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: ${({ theme, $nota }) =>
    $nota >= 7
      ? theme.cores.notaBoa
      : $nota >= 5
        ? theme.cores.notaMedia
        : theme.cores.notaRuim};
  background: ${({ theme }) => theme.cores.fundo};
`;

export const TextoNota = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme }) => theme.cores.texto};
`;

export const AcoesCartao = styled.View`
  flex-direction: row;
  margin-top: 8px;
`;

export const BotaoPequeno = styled(RectButton)`
  flex: 1;
  height: 34px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  background: ${({ theme, $variante }) =>
    $variante === "perigo"
      ? theme.cores.perigo
      : $variante === "concluido"
        ? theme.cores.superficieAlternativa
        : theme.cores.primaria};
`;

/* numberOfLines: 1 evita que rótulos longos ("VER DETALHES") quebrem em duas
   linhas dentro do botão, que tem altura fixa de 34px. */
export const TextoBotaoPequeno = styled.Text.attrs({ numberOfLines: 1 })`
  font-size: 11px;
  font-weight: bold;
  color: ${({ theme, $variante }) =>
    $variante === "perigo"
      ? "#FFFFFF"
      : $variante === "concluido"
        ? theme.cores.textoSuave
        : "#06283d"};
  text-transform: uppercase;
`;

export const DicaCategoria = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.cores.textoSuave};
  margin-top: 2px;
`;

/* --- Estados vazios / carregando ----------------------------------- */

export const EstadoVazio = styled.View`
  align-items: center;
  justify-content: center;
  padding: 48px 32px;
`;

export const TituloVazio = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.cores.texto};
  margin-top: 12px;
  text-align: center;
`;

export const TextoVazio = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.cores.textoSuave};
  margin-top: 6px;
  text-align: center;
  line-height: 19px;
`;

export const CaixaCarregando = styled.View`
  padding: 40px;
  align-items: center;
`;

/* --- Avisos e cabeçalho de resultados ------------------------------ */

export const CaixaAviso = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin: 4px 20px 12px;
  padding: 12px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.cores.perigo};
  background: ${({ theme }) => theme.cores.superficieAlternativa};
`;

export const TextoAviso = styled.Text`
  flex: 1;
  margin-left: 8px;
  font-size: 12px;
  line-height: 18px;
  color: ${({ theme }) => theme.cores.texto};
`;

export const CabecalhoResultados = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 10px;
`;

export const BotaoLimpar = styled(RectButton)`
  flex-direction: row;
  align-items: center;
  padding: 5px 9px;
  border-radius: 8px;
  background: ${({ theme }) => theme.cores.superficieAlternativa};
`;

export const TextoBotaoLimpar = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: ${({ theme }) => theme.cores.textoSuave};
  margin-left: 4px;
  text-transform: uppercase;
`;

export const RodapeCarregando = styled.View`
  padding: 16px;
  align-items: center;
`;

export const CaixaMensagem = styled.View`
  margin: 0 20px 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.cores.destaque};
  background: ${({ theme }) => theme.cores.superficieAlternativa};
`;

export const TextoMensagem = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.cores.texto};
`;

/* ------------------------------------------------------------------ *
 * Tela de DETALHES
 * ------------------------------------------------------------------ */

export const RolagemDetalhes = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: { paddingBottom: 60 },
})`
  flex: 1;
  background: ${({ theme }) => theme.cores.fundo};
`;

export const CaixaBanner = styled.View`
  height: 210px;
  background: ${({ theme }) => theme.cores.superficieAlternativa};
`;

export const ImagemBanner = styled.Image`
  width: 100%;
  height: 100%;
`;

export const CorpoDetalhes = styled.View`
  padding: 0 20px;
`;

export const TopoDetalhes = styled.View`
  flex-direction: row;
  margin-top: -70px;
`;

export const PosterDetalhes = styled.Image`
  width: 110px;
  height: 165px;
  border-radius: 10px;
  background: ${({ theme }) => theme.cores.superficieAlternativa};
`;

export const InfoTopoDetalhes = styled.View`
  flex: 1;
  margin-left: 14px;
  margin-top: 78px;
`;

export const TituloDetalhes = styled.Text`
  font-size: 19px;
  font-weight: bold;
  color: ${({ theme }) => theme.cores.texto};
`;

export const ResumoDetalhes = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.cores.textoSuave};
  margin-top: 4px;
`;

export const EtiquetaTipo = styled.View`
  align-self: flex-start;
  border-radius: 6px;
  padding: 3px 8px;
  margin-bottom: 6px;
  background: ${({ theme }) => theme.cores.primaria};
`;

export const TextoEtiquetaTipo = styled.Text`
  font-size: 10px;
  font-weight: bold;
  color: #06283d;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const LinhaEtiquetas = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 14px;
`;

export const Etiqueta = styled.View`
  border-radius: 20px;
  padding: 6px 12px;
  margin-right: 8px;
  margin-bottom: 8px;
  background: ${({ theme }) => theme.cores.superficieAlternativa};
`;

export const TextoEtiqueta = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.cores.texto};
`;

export const Sinopse = styled.Text`
  font-size: 14px;
  line-height: 21px;
  color: ${({ theme }) => theme.cores.textoSuave};
  margin-top: 10px;
`;

export const GradeInformacoes = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 14px;
`;

export const CaixaInformacao = styled.View`
  width: 50%;
  margin-bottom: 14px;
`;

export const RotuloInformacao = styled.Text`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.cores.textoSuave};
`;

export const ValorInformacao = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.cores.texto};
  margin-top: 3px;
`;

export const LinhaAcoes = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 18px;
`;

export const BotaoPilula = styled(RectButton)`
  height: 42px;
  border-radius: 10px;
  padding-horizontal: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  margin-bottom: 10px;
  background: ${({ theme, $ativo, $variante }) =>
    $variante === "perigo"
      ? theme.cores.perigo
      : $ativo
        ? theme.cores.primaria
        : theme.cores.superficieAlternativa};
`;

export const TextoBotaoPilula = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme, $ativo, $variante }) =>
    $variante === "perigo"
      ? "#FFFFFF"
      : $ativo
        ? "#06283d"
        : theme.cores.texto};
  margin-left: 6px;
`;

/* --- Avaliação com estrelas ---------------------------------------- */

export const LinhaEstrelas = styled.View`
  flex-direction: row;
  margin-top: 8px;
`;

export const BotaoEstrela = styled(RectButton)`
  padding: 4px;
  margin-right: 2px;
`;

/* --- Elenco -------------------------------------------------------- */

export const TituloBloco = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.cores.texto};
  margin-top: 24px;
  margin-bottom: 10px;
`;

export const ListaElenco = styled.FlatList.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: { paddingRight: 20, paddingBottom: 6 },
})``;

export const ListaSimilares = styled.FlatList.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: { paddingRight: 20, paddingBottom: 6 },
})``;

export const CardAtor = styled.View`
  width: 84px;
  margin-right: 12px;
  align-items: center;
`;

export const FotoAtor = styled.Image`
  width: 68px;
  height: 68px;
  border-radius: 34px;
  background: ${({ theme }) => theme.cores.superficieAlternativa};
`;

export const NomeAtor = styled.Text.attrs({ numberOfLines: 2 })`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.cores.texto};
  text-align: center;
  margin-top: 6px;
`;

export const PapelAtor = styled.Text.attrs({ numberOfLines: 2 })`
  font-size: 10px;
  color: ${({ theme }) => theme.cores.textoSuave};
  text-align: center;
  margin-top: 2px;
`;

/* --- Similares ----------------------------------------------------- */

export const CardSimilar = styled(RectButton)`
  width: 116px;
  margin-right: 12px;
`;

export const PosterSimilar = styled.Image`
  width: 116px;
  height: 174px;
  border-radius: 10px;
  background: ${({ theme }) => theme.cores.superficieAlternativa};
`;

export const NomeSimilar = styled.Text.attrs({ numberOfLines: 2 })`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.cores.texto};
  margin-top: 6px;
`;

export const AnoSimilar = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.cores.textoSuave};
  margin-top: 2px;
`;
