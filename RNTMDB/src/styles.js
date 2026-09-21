import styled from "styled-components/native";
import { RectButton } from "react-native-gesture-handler";

/**
 * Estilos centralizados do app (mesma organização do projeto GitViewer).
 * Todos os componentes leem as cores do tema, então trocar claro/escuro
 * é só chamar toggleTheme() no ThemeContext.
 *
 * Props que servem apenas para o estilo começam com "$" e por isso não são
 * repassadas para os componentes nativos.
 */

/* ------------------------------------------------------------------ *
 * Estrutura geral
 * ------------------------------------------------------------------ */

export const Screen = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.colors.background};
`;

export const CenteredScreen = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.colors.background};
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

export const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin: 24px 20px 12px;
`;

export const MutedText = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ErrorText = styled.Text`
  align-self: flex-start;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.danger};
  margin-top: 4px;
  margin-left: 2px;
`;

/* ------------------------------------------------------------------ *
 * LOGIN e CADASTRO
 * ------------------------------------------------------------------ */

export const AuthContainer = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.colors.background};
  align-items: center;
  justify-content: center;
  padding-horizontal: 28px;
`;

export const LogoMark = styled.View`
  width: 68px;
  height: 68px;
  border-radius: 34px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.header};
  margin-bottom: 14px;
`;

export const Brand = styled.Text`
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 2px;
  color: ${({ theme }) => theme.colors.text};
`;

export const BrandHighlight = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
`;

export const BrandSubtitle = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 6px;
  margin-bottom: 28px;
  text-align: center;
`;

export const InputWrapper = styled.View`
  width: 100%;
  margin-bottom: 14px;
`;

export const FieldLabel = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 6px;
  margin-left: 2px;
`;

export const Input = styled.TextInput.attrs({
  placeholderTextColor: "#8A9099",
})`
  width: 100%;
  height: 46px;
  border-radius: 10px;
  padding: 0 14px;
  font-size: 15px;
  border-width: 1px;
  border-color: ${({ theme, $invalid }) =>
    $invalid ? theme.colors.danger : theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
`;

export const PrimaryButton = styled(RectButton)`
  width: 100%;
  height: 50px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary};
  margin-top: 8px;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

export const PrimaryButtonText = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #06283d;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const OutlineButton = styled(RectButton)`
  width: 100%;
  height: 50px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.primary};
`;

export const OutlineButtonText = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const FormScroll = styled.ScrollView.attrs({
  contentContainerStyle: { paddingBottom: 40 },
  keyboardShouldPersistTaps: "handled",
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
  background: ${({ theme }) => theme.colors.background};
`;

export const FormBody = styled.View`
  padding-horizontal: 24px;
`;

/* ------------------------------------------------------------------ *
 * Tela principal (CARDS)
 * ------------------------------------------------------------------ */

export const GreetingRow = styled.View`
  padding: 16px 20px 8px;
`;

export const Greeting = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

export const GreetingHint = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

export const SearchRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 8px 20px 12px;
`;

export const SearchInput = styled.TextInput.attrs({
  placeholderTextColor: "#8A9099",
})`
  flex: 1;
  height: 44px;
  border-radius: 10px;
  padding: 0 14px;
  font-size: 15px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
`;

export const AddButton = styled(RectButton)`
  width: 48px;
  height: 44px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  background: ${({ theme }) => theme.colors.primary};
  opacity: ${({ $loading }) => ($loading ? 0.7 : 1)};
`;

export const SegmentRow = styled.View`
  flex-direction: row;
  padding: 0 12px 8px;
`;

export const Segment = styled(RectButton)`
  flex: 1;
  height: 38px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin-horizontal: 4px;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.surfaceAlt};
`;

export const SegmentText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme, $active }) =>
    $active ? "#06283d" : theme.colors.textMuted};
`;

export const List = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: { paddingBottom: 120 },
})`
  flex: 1;
  margin-top: 8px;
`;

/* --- Card ---------------------------------------------------------- */

export const Card = styled.View`
  flex-direction: row;
  margin: 0 20px 14px;
  border-radius: 12px;
  padding: 10px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  /* Elevação do Material Design: aplicada no tema claro e dispensada no escuro,
     seguindo a recomendação do Material (no dark theme a separação é por cor). */
  elevation: ${({ theme }) => (theme.mode === "dark" ? 0 : 2)};
  shadow-color: #0b1220;
  shadow-opacity: ${({ theme }) => (theme.mode === "dark" ? 0 : 0.12)};
  shadow-radius: 8px;
  shadow-offset: 0px 2px;
`;

export const CardPoster = styled.Image`
  width: 84px;
  height: 126px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
`;

export const PosterFallback = styled.View`
  width: 84px;
  height: 126px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.surfaceAlt};
`;

export const CardInfo = styled.View`
  flex: 1;
  margin-left: 12px;
`;

export const TitleRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

export const CardTitle = styled.Text.attrs({ numberOfLines: 2 })`
  flex: 1;
  margin-right: 8px;
  font-size: 15px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

export const CardMeta = styled.Text.attrs({ numberOfLines: 1 })`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 3px;
`;

export const StatusTag = styled.View`
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  border-radius: 20px;
  padding: 3px 9px;
  margin-top: 6px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
`;

export const StatusDot = styled.View`
  width: 7px;
  height: 7px;
  border-radius: 4px;
  margin-right: 6px;
  background: ${({ theme }) => theme.colors.accent};
`;

export const StatusText = styled.Text`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const RatingBadge = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: ${({ theme, $score }) =>
    $score >= 7
      ? theme.colors.ratingGood
      : $score >= 5
        ? theme.colors.ratingMid
        : theme.colors.ratingBad};
  background: ${({ theme }) => theme.colors.background};
`;

export const RatingText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

export const CardActions = styled.View`
  flex-direction: row;
  margin-top: 8px;
`;

export const SmallButton = styled(RectButton)`
  flex: 1;
  height: 34px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  background: ${({ theme, $variant }) =>
    $variant === "danger"
      ? theme.colors.danger
      : $variant === "done"
        ? theme.colors.surfaceAlt
        : theme.colors.primary};
`;

export const SmallButtonText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: ${({ theme, $variant }) =>
    $variant === "danger"
      ? "#FFFFFF"
      : $variant === "done"
        ? theme.colors.textMuted
        : "#06283d"};
  text-transform: uppercase;
`;

export const CategoryHint = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

/* --- Estados vazios / carregando ----------------------------------- */

export const EmptyState = styled.View`
  align-items: center;
  justify-content: center;
  padding: 48px 32px;
`;

export const EmptyTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 12px;
  text-align: center;
`;

export const EmptyText = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 6px;
  text-align: center;
  line-height: 19px;
`;

export const LoadingBox = styled.View`
  padding: 40px;
  align-items: center;
`;

/* --- Avisos e cabeçalho de resultados ------------------------------ */

export const WarningBox = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin: 4px 20px 12px;
  padding: 12px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.danger};
  background: ${({ theme }) => theme.colors.surfaceAlt};
`;

export const WarningText = styled.Text`
  flex: 1;
  margin-left: 8px;
  font-size: 12px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.text};
`;

export const ResultsHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 10px;
`;

export const ClearButton = styled(RectButton)`
  flex-direction: row;
  align-items: center;
  padding: 5px 9px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
`;

export const ClearButtonText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-left: 4px;
  text-transform: uppercase;
`;

export const FooterLoading = styled.View`
  padding: 16px;
  align-items: center;
`;

export const FeedbackBox = styled.View`
  margin: 0 20px 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.surfaceAlt};
`;

export const FeedbackText = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

/* --- Roleta -------------------------------------------------------- */

export const DiceButton = styled(RectButton)`
  position: absolute;
  right: 20px;
  bottom: 24px;
  height: 54px;
  border-radius: 27px;
  padding-horizontal: 18px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary};
`;

export const DiceButtonText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #06283d;
  margin-left: 8px;
  text-transform: uppercase;
`;

export const ModalOverlay = styled.Pressable`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 28px;
  background: rgba(0, 0, 0, 0.75);
`;

export const ModalCard = styled.Pressable`
  width: 100%;
  border-radius: 16px;
  padding: 22px;
  align-items: center;
  background: ${({ theme }) => theme.colors.surface};
`;

export const ModalTitle = styled.Text`
  font-size: 17px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

export const ModalText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  margin-top: 4px;
`;

/* ------------------------------------------------------------------ *
 * Tela de DETALHES
 * ------------------------------------------------------------------ */

export const DetailScroll = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: { paddingBottom: 60 },
})`
  flex: 1;
  background: ${({ theme }) => theme.colors.background};
`;

export const BackdropWrapper = styled.View`
  height: 210px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
`;

export const BackdropImage = styled.Image`
  width: 100%;
  height: 100%;
`;

export const DetailBody = styled.View`
  padding: 0 20px;
`;

export const DetailTop = styled.View`
  flex-direction: row;
  margin-top: -70px;
`;

export const DetailPoster = styled.Image`
  width: 110px;
  height: 165px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
`;

export const DetailTopInfo = styled.View`
  flex: 1;
  margin-left: 14px;
  margin-top: 78px;
`;

export const DetailTitle = styled.Text`
  font-size: 19px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

export const DetailMeta = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 4px;
`;

export const TypeTag = styled.View`
  align-self: flex-start;
  border-radius: 6px;
  padding: 3px 8px;
  margin-bottom: 6px;
  background: ${({ theme }) => theme.colors.primary};
`;

export const TypeTagText = styled.Text`
  font-size: 10px;
  font-weight: bold;
  color: #06283d;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const ChipRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 14px;
`;

export const Chip = styled.View`
  border-radius: 20px;
  padding: 6px 12px;
  margin-right: 8px;
  margin-bottom: 8px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
`;

export const ChipText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text};
`;

export const Overview = styled.Text`
  font-size: 14px;
  line-height: 21px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 10px;
`;

export const InfoGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 14px;
`;

export const InfoBox = styled.View`
  width: 50%;
  margin-bottom: 14px;
`;

export const InfoLabel = styled.Text`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const InfoValue = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 3px;
`;

export const ActionRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 18px;
`;

export const PillButton = styled(RectButton)`
  height: 42px;
  border-radius: 10px;
  padding-horizontal: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  margin-bottom: 10px;
  background: ${({ theme, $active, $variant }) =>
    $variant === "danger"
      ? theme.colors.danger
      : $active
        ? theme.colors.primary
        : theme.colors.surfaceAlt};
`;

export const PillButtonText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme, $active, $variant }) =>
    $variant === "danger"
      ? "#FFFFFF"
      : $active
        ? "#06283d"
        : theme.colors.text};
  margin-left: 6px;
`;

/* --- Avaliação com estrelas ---------------------------------------- */

export const StarsRow = styled.View`
  flex-direction: row;
  margin-top: 8px;
`;

export const StarButton = styled(RectButton)`
  padding: 4px;
  margin-right: 2px;
`;

/* --- Elenco -------------------------------------------------------- */

export const BlockTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 24px;
  margin-bottom: 10px;
`;

export const CastList = styled.FlatList.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: { paddingRight: 20, paddingBottom: 6 },
})``;

export const SimilarList = styled.FlatList.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: { paddingRight: 20, paddingBottom: 6 },
})``;

export const CastCard = styled.View`
  width: 84px;
  margin-right: 12px;
  align-items: center;
`;

export const CastAvatar = styled.Image`
  width: 68px;
  height: 68px;
  border-radius: 34px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
`;

export const CastName = styled.Text.attrs({ numberOfLines: 2 })`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-top: 6px;
`;

export const CastRole = styled.Text.attrs({ numberOfLines: 2 })`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  margin-top: 2px;
`;

/* --- Similares ----------------------------------------------------- */

export const SimilarCard = styled(RectButton)`
  width: 116px;
  margin-right: 12px;
`;

export const SimilarPoster = styled.Image`
  width: 116px;
  height: 174px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
`;

export const SimilarName = styled.Text.attrs({ numberOfLines: 2 })`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 6px;
`;

export const SimilarYear = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;
