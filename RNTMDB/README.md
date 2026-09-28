# RNTMDB — Projeto React Native (1º Bimestre)

Trabalho avaliativo da disciplina de React Native — **FATEC Franca "Dr. Thomaz Novelino"**.

Aplicação mobile para montar uma lista pessoal de **filmes e séries**, consumindo a API
gratuita do **TMDb (The Movie Database)**.

> **INTEGRANTE**
>
> ## Danilo Benedetti Ribeiro
>
> Projeto desenvolvido **individualmente** (o trabalho permite dupla ou individual).

---

## 1. Requisitos do trabalho e onde foram atendidos

| # | Requisito | Tela / arquivo |
|---|-----------|----------------|
| 1 | **LOGIN** — campos Usuário e Senha; botões ENTRAR e CADASTRAR USUÁRIO | `src/pages/login.js` |
| 2 | **CADASTRAR USUÁRIO** — Nome, Telefone, CPF, E-mail, Curso; botão SALVAR que persiste localmente e volta ao LOGIN | `src/pages/cadastro.js` |
| 3 | **CARDS** — busca os dados na API e cria cards com imagem, nome e **status**; botões ADD, EXCLUIR e VER DETALHES | `src/pages/main.js` |
| 4 | **MAIS DETALHES DOS CARDS** — detalhes completos do card selecionado | `src/pages/details.js` |

### Como cada requisito foi interpretado

- **Persistência local ("LocalStorage")**: no React Native o equivalente é o
  **AsyncStorage** (`@react-native-async-storage/async-storage`), usado com as mesmas
  chaves e o mesmo padrão do projeto desenvolvido em sala (`GitViewer`).
- **Campo "Usuário" do LOGIN**: como o cadastro não possui campo de nome de usuário,
  o login usa o **e-mail** cadastrado. A busca é feita sem diferenciar maiúsculas/minúsculas.
- **Campo "Senha" no cadastro**: o PDF define os campos do cadastro (Nome, Telefone, CPF,
  E-mail, Curso) mas exige uma **senha** na tela de LOGIN. Para que o login funcione, o
  formulário de cadastro também coleta uma **Senha** (mínimo de 6 caracteres).
- **"Status" do card**: atendido com o campo **`status` da própria API do TMDb**
  (`Released` → "Lançado", `Returning Series` → "Em exibição", `Canceled` → "Cancelado" etc.).
  Como os endpoints de busca e de destaques não retornam esse campo, ao tocar em **ADD** o
  app consulta os **detalhes completos** do título antes de salvar o card — assim o status
  aparece de verdade no card.

---

## 2. API utilizada: TMDb

- Documentação: <https://developer.themoviedb.org/docs/getting-started>
- Base: `https://api.themoviedb.org/3`
- Autenticação: **API Key v3** (parâmetro `api_key`)
- Imagens: `https://image.tmdb.org/t/p/{tamanho}{caminho}`
- Idioma: todas as requisições usam `language=pt-BR`, por isso sinopses, títulos e
  gêneros aparecem em português.

### Endpoints consumidos

| Endpoint | Para que serve no app |
|----------|----------------------|
| `GET /trending/all/week` | Alimenta a aba **Destaques** (feed inicial, com paginação) |
| `GET /search/multi` | Barra de busca, procurando filmes e séries ao mesmo tempo |
| `GET /movie/{id}` | Detalhes completos de um filme |
| `GET /tv/{id}` | Detalhes completos de uma série |
| `append_to_response=credits,videos,similar` | Traz **elenco**, **trailer** e **similares** na mesma requisição |

A regra de negócio (adicionar card, remover, trocar de categoria, dar nota) roda toda
no aparelho, sem backend próprio.

---

## 3. Como executar

### Pré-requisitos

- **Node.js 20+**
- Aplicativo **Expo Go** no celular (Android/iOS) **ou** um emulador Android/iOS
- Uma **API Key v3 do TMDb** (gratuita)

### Passo 1 — Obter a API Key do TMDb

1. Crie uma conta em <https://www.themoviedb.org/signup> e confirme o e-mail
2. Acesse **Configurações → API** (`https://www.themoviedb.org/settings/api`)
3. Clique em **Request an API Key** e escolha a opção **Developer**
4. Preencha o formulário:

   | Campo | O que preencher |
   |-------|-----------------|
   | **Type of Use** | `Educational` (é um projeto de faculdade) — a aprovação é imediata |
   | **Application Name** | `RNTMDB` |
   | **Application URL** | A URL do repositório no GitHub, ex.: `https://github.com/seu-usuario/NTMDB` |
   | **Application Summary** | "Aplicativo React Native (Expo) desenvolvido para a disciplina de React Native da FATEC. Consome a API do TMDb para montar uma lista pessoal de filmes e séries." |

   > **O projeto ainda não tem site publicado?** Use a URL do seu perfil/repositório do GitHub
   > (`https://github.com/seu-usuario`). O campo não aceita `N/A` desde 2025, porque valida
   > o formato da URL.

5. Copie a **API Key (v3 auth)** na página de configurações

   > A página mostra **duas** credenciais: a **API Key (v3 auth)** e o
   > **API Read Access Token (v4 auth)**. Este app usa a **v3** — não confunda.

   > A própria documentação do TMDb avisa: faça esse cadastro pelo navegador do
   > computador, porque o processo não é otimizado para celular.

### Passo 2 — Configurar a chave no projeto

Na raiz do projeto existe o arquivo `.env.example`. Crie uma cópia chamada `.env` e
cole a sua chave:

```bash
cp .env.example .env      # Windows (PowerShell): copy .env.example .env
```

Conteúdo do `.env`:

```
EXPO_PUBLIC_TMDB_API_KEY=cole_sua_chave_aqui
```

> O arquivo `.env` está no `.gitignore` e **não** vai para o GitHub.
> Sem a chave, o app abre normalmente mas mostra um aviso vermelho na tela de cards
> e não carrega os dados do TMDb.

### Passo 3 — Instalar e rodar

```bash
npm install
npx expo start --clear
```

Depois escaneie o QR Code com o **Expo Go** (Android) ou com a câmera (iOS), ou
pressione `a` / `i` no terminal para abrir no emulador.

> ⚠️ Se você editar o `.env` depois, reinicie o servidor com `npx expo start --clear`:
> variáveis `EXPO_PUBLIC_*` são gravadas no bundle no momento da build.

### Roteiro rápido para a apresentação

1. **CADASTRAR USUÁRIO** → preencha os dados (o CPF e o telefone são validados de verdade)
   → **SALVAR** → volta ao LOGIN com o e-mail preenchido
2. **ENTRAR** → entra na tela **MEUS CARDS**
3. Na aba **Destaques**, toque em **ADD** em alguns títulos
4. Use as abas **Quero ver / Assistidos / Favoritos** para organizar
5. **VER DETALHES** → sinopse, elenco, trailer, similares, notar com estrelas
6. Toque no ícone **☀️/🌙** no cabeçalho para alternar o tema claro/escuro

---

## 4. Estrutura do projeto

A organização segue a do projeto feito em aula (`GitViewer`). As **pastas e os arquivos**
continuam com os nomes em inglês (`pages/`, `styles.js`, `login.js`...), como é comum em
projetos React Native — o que está em português é o **código dentro dos arquivos**.

```
RNTMDB/
├── App.js                        # Provedores (tema + biblioteca) e NavigationContainer
├── index.js                      # Entrada do Expo
├── .env.example                  # Modelo da variável da API Key
└── src/
    ├── routes.js                 # Stack de navegação e cabeçalhos
    ├── styles.js                 # Estilos centralizados (styled-components)
    ├── config/tmdb.js            # Chave, URLs base, idioma e tamanhos de imagem
    ├── services/api.js           # Instância axios + funções dos endpoints
    ├── contexts/
    │   ├── ThemeContext.js       # Tema claro/escuro persistido
    │   └── LibraryContext.js     # Cards do usuário persistidos no AsyncStorage
    ├── components/
    │   ├── FormField.js          # Campo de formulário com rótulo e erro
    │   ├── MovieCard.js          # O card (imagem, nome, status, nota e ações)
    │   └── SegmentTabs.js        # Abas da tela de cards
    ├── pages/
    │   ├── login.js              # Tela 1 - LOGIN
    │   ├── cadastro.js           # Tela 2 - CADASTRO
    │   ├── main.js               # Tela 3 - CARDS
    │   └── details.js            # Tela 4 - MAIS DETALHES
    └── utils/
        ├── format.js             # Formatação/normalização dos dados do TMDb
        └── validators.js         # Máscaras e validação de CPF, telefone e e-mail
```

### De inglês para português

Os **componentes, variáveis, funções, estilos e cores do tema** foram renomeados para
português dentro dos arquivos. As telas da navegação também usam nomes em português:
`entrar`, `cadastro`, `cards` e `detalhes`.

| Onde | Antes | Agora |
|------|-------|-------|
| Componentes | `MovieCard` · `FormField` · `SegmentTabs` | `CardDeFilme` · `CampoFormulario` · `AbasSegmento` |
| Contextos | `LibraryContext` · `ThemeContext` | `ContextoBiblioteca` · `ContextoTema` |
| Estilos | `Card` · `CardPoster` · `RatingBadge` | `Cartao` · `PosterCartao` · `SeloNota` (todos na seção 7) |

**Contextos e hooks**

- `useTheme` → `useTema`, `ThemeProvider` → `ProvedorTema`, `toggleTheme` → `alternarTema`,
  `isDark` → `temaEscuro`, `colors` → `cores`, `mode` → `modo`
- `useLibrary` → `useBiblioteca`, `LibraryProvider` → `ProvedorBiblioteca`,
  `items` → `itens`, `addItem` → `adicionarItem`, `removeItem` → `removerItem`,
  `isInLibrary` → `estaNaBiblioteca`, `setCategory` → `definirCategoria`,
  `rateItem` → `avaliarItem`

**Cores do tema**

- `background` → `fundo`, `surface` → `superficie`, `surfaceAlt` → `superficieAlternativa`,
  `border` → `borda`, `text` → `texto`, `textMuted` → `textoSuave`
- `primary` → `primaria`, `accent` → `destaque`, `danger` → `perigo`
- `header` → `cabecalho`, `headerText` → `textoCabecalho`
- `ratingGood` / `ratingMid` / `ratingBad` → `notaBoa` / `notaMedia` / `notaRuim`

**Funções**

- API: `getTrending` → `buscarDestaques`, `searchTitles` → `buscarTitulos`,
  `getDetails` → `buscarDetalhes`, `hasApiKey` → `temChaveApi`
- Formatação: `formatVote` → `formatarNota`, `formatDate` → `formatarData`,
  `formatRuntime` → `formatarDuracao`, `formatMoney` → `formatarDinheiro`,
  `posterUrl` → `urlPoster`, `backdropUrl` → `urlBanner`, `profileUrl` → `urlPerfil`,
  `cardKey` → `chaveDoCartao`, `buildSubtitle` → `montarSubtitulo`,
  `normalizeDetails` → `normalizarDetalhes`,
  `normalizeSearchResult` → `normalizarResultadoBusca`,
  `translateStatus` → `traduzirStatus`, `pluralizeSeasons` → `pluralizarTemporadas`,
  `pluralizeEpisodes` → `pluralizarEpisodios`
- Validação: `isValidCPF` → `cpfValido`, `maskCPF` → `mascararCpf`,
  `isValidPhone` → `telefoneValido`, `maskPhone` → `mascararTelefone`,
  `isValidEmail` → `emailValido`, `onlyDigits` → `apenasDigitos`

### O que continua em inglês (e por quê)

- **Pastas e arquivos**: `pages/`, `components/`, `contexts/`, `utils/`, `services/`,
  `config/`, `styles.js`, `routes.js`, `main.js`, `login.js`, `format.js`,
  `validators.js`. É a convenção usada no projeto feito em aula, e nomes de arquivo em
  inglês (`login.js`, `styles.js`) são o padrão do ecossistema React Native.
- **Campos vindos da API do TMDb**: `poster_path`, `vote_average`, `media_type` e os
  campos do card normalizado (`posterPath`, `voteAverage`, `mediaType`, `statusLabel`...).
  São os nomes que a API devolve, então manter o mesmo nome permite comparar o código
  com a documentação do TMDb linha por linha.
- **Valores de status e categorias gravados no aparelho**: `Released`, `watchlist`,
  `watched`, `favorite` e as chaves `user`, `library` e `theme` do AsyncStorage.
  São dados já salvos: mudar essas strings faria o app perder a conta e a lista de cards
  que o usuário já tinha.

### Principais dependências

| Pacote | Uso |
|--------|-----|
| `@react-navigation/native` + `@react-navigation/stack` | Navegação entre telas |
| `axios` | Requisições HTTP para o TMDb |
| `@react-native-async-storage/async-storage` | Persistência local (usuário, cards e tema) |
| `styled-components` | Estilização (mesmo padrão do projeto da aula) |
| `@expo/vector-icons` | Ícones (Ionicons) |
| `react-native-gesture-handler` / `react-native-screens` / `react-native-safe-area-context` | Exigidos pela navegação |

---

## 5. Funcionalidades extras (além do exigido)

- **Feed inicial de destaques** (trending do TMDb) com *pull-to-refresh* e paginação infinita
- **Abas de organização**: Destaques, Quero assistir, Assistidos e Favoritos
- **Tema claro/escuro** estilo cinema, com a escolha salva no aparelho
- **Tela de detalhes completa**: sinopse, elenco com fotos, trailer no YouTube,
  títulos similares (tocar em um similar abre os detalhes dele), orçamento e receita
- **Nota pessoal de 1 a 5 estrelas** por título, além da nota do TMDb
- **Validação real** de CPF (com dígitos verificadores), telefone (DDD e nono dígito),
  e-mail e senha, com máscaras aplicadas durante a digitação
- **Compartilhamento** do título pela folha nativa de compartilhamento
- **Tratamento de erros** de rede e de API Key com mensagens em português

### Material Design

O conteúdo programático da disciplina inclui **Material Design**, e o projeto aplica
os seguintes princípios:

- **Ícones**: todos usam o **MaterialIcons** (`@expo/vector-icons`) — o mesmo conjunto
  do projeto desenvolvido em aula, e não ícones de estilo próprio.
- **Elevação**: os cards usam `elevation` (Android) e `shadow` (iOS) no tema claro e
  ficam planos no tema escuro, separados por cor de superfície — exatamente como o
  Material recomenda para *dark theme*.
- **Ripple nativo**: os botões são `RectButton` (`react-native-gesture-handler`), que
  já traz o efeito de ondulação (*ripple*) do Android ao toque.
- **Superfícies e cantos**: raios de canto consistentes (8–16 px) e separação de
  conteúdo por superfícies (`superficie` / `superficieAlternativa`) em vez de linhas pesadas.

---

## 6. Solução de problemas

| Sintoma | Causa provável / solução |
|---------|--------------------------|
| Aviso "API Key do TMDb não configurada" | O arquivo `.env` está vazio. Cole a chave e rode `npx expo start --clear` |
| "API Key inválida ou expirada" | A chave foi copiada errada ou é um *token v4* em vez da *API Key v3* |
| Cards não aparecem em Destaques | Verifique a internet do aparelho; use o botão **Tentar novamente** |
| Alterei o `.env` mas o aviso da API Key continua aparecendo | O Metro guarda em cache a transformação dos arquivos e **não** invalida esse cache quando o `.env` muda — a chave antiga (vazia) continua no bundle. Reinicie com `npx expo start --clear` |

---

## 7. Dicionário dos estilos (`src/styles.js`)

Todos os estilos são componentes `styled-components` exportados com nome em português.
A tabela abaixo serve de consulta durante a apresentação: mostra o nome atual, o nome
antigo (em inglês) e para que o estilo serve.

| Nome no código | Antes (inglês) | Para que serve |
|----------------|----------------|----------------|
| `Tela` | `Screen` | Tela base, com o fundo do tema |
| `TelaCentralizada` | `CenteredScreen` | Tela com o conteúdo no centro |
| `TituloSecao` | `SectionTitle` | Título de seção (ex.: "Seus dados") |
| `TextoSuave` | `MutedText` | Texto secundário, mais discreto |
| `TextoDeErro` | `ErrorText` | Mensagem de erro do formulário |
| `ContainerAutenticacao` | `AuthContainer` | Container do LOGIN e do CADASTRO |
| `LogoMarca` | `LogoMark` | Círculo com o ícone do app |
| `Marca` | `Brand` | Nome "RNTMDB" |
| `MarcaDestaque` | `BrandHighlight` | Parte "TMDB" em azul |
| `MarcaSubtitulo` | `BrandSubtitle` | Frase abaixo da marca |
| `CaixaCampo` | `InputWrapper` | Agrupa rótulo + campo + erro |
| `RotuloCampo` | `FieldLabel` | Rótulo do campo ("Nome", "CPF"...) |
| `CampoEntrada` | `Input` | Caixa de digitação do formulário |
| `BotaoPrincipal` | `PrimaryButton` | Botão cheio (ENTRAR, SALVAR) |
| `TextoBotaoPrincipal` | `PrimaryButtonText` | Texto do botão cheio |
| `BotaoContorno` | `OutlineButton` | Botão só com contorno |
| `TextoBotaoContorno` | `OutlineButtonText` | Texto do botão de contorno |
| `RolagemFormulario` | `FormScroll` | Rolagem da tela de cadastro |
| `CorpoFormulario` | `FormBody` | Margem lateral dos campos |
| `LinhaSaudacao` | `GreetingRow` | Faixa do "Olá, Danilo" |
| `Saudacao` | `Greeting` | Texto "Olá, nome" |
| `DicaSaudacao` | `GreetingHint` | Quantos títulos a lista tem |
| `LinhaBusca` | `SearchRow` | Linha da barra de busca |
| `CampoBusca` | `SearchInput` | Campo de busca |
| `BotaoBuscar` | `AddButton` | Botão da lupa |
| `LinhaAbas` | `SegmentRow` | Linha das abas |
| `Aba` | `Segment` | Cada aba (Destaques, Assistidos...) |
| `TextoAba` | `SegmentText` | Texto da aba |
| `Lista` | `List` | `FlatList` dos cards |
| `Cartao` | `Card` | Card do filme/série |
| `PosterCartao` | `CardPoster` | Imagem do pôster no card |
| `PosterAlternativo` | `PosterFallback` | Quadro quando não há imagem |
| `InformacoesCartao` | `CardInfo` | Coluna de textos do card |
| `LinhaTitulo` | `TitleRow` | Título e nota lado a lado |
| `TituloCartao` | `CardTitle` | Nome do filme/série |
| `ResumoCartao` | `CardMeta` | Linha "2024 • 2h 15min" |
| `EtiquetaStatus` | `StatusTag` | Pílula do status |
| `PontoStatus` | `StatusDot` | Bolinha verde da pílula |
| `TextoStatus` | `StatusText` | Texto do status ("Lançado") |
| `SeloNota` | `RatingBadge` | Círculo com a nota do TMDb |
| `TextoNota` | `RatingText` | Número da nota |
| `AcoesCartao` | `CardActions` | Linha dos botões do card |
| `BotaoPequeno` | `SmallButton` | Botão pequeno (ADD, EXCLUIR) |
| `TextoBotaoPequeno` | `SmallButtonText` | Texto do botão pequeno |
| `DicaCategoria` | `CategoryHint` | Mostra em que aba o card está |
| `EstadoVazio` | `EmptyState` | Área de "lista vazia" |
| `TituloVazio` | `EmptyTitle` | Título do estado vazio |
| `TextoVazio` | `EmptyText` | Explicação do estado vazio |
| `CaixaCarregando` | `LoadingBox` | Área do indicador de carregamento |
| `CaixaAviso` | `WarningBox` | Aviso vermelho da API Key |
| `TextoAviso` | `WarningText` | Texto do aviso |
| `CabecalhoResultados` | `ResultsHeader` | Cabeçalho "5 resultados para..." |
| `BotaoLimpar` | `ClearButton` | Botão LIMPAR da busca |
| `TextoBotaoLimpar` | `ClearButtonText` | Texto do botão limpar |
| `RodapeCarregando` | `FooterLoading` | Indicador no fim da lista |
| `CaixaMensagem` | `FeedbackBox` | Faixa de confirmação ("adicionado") |
| `TextoMensagem` | `FeedbackText` | Texto da confirmação |
| `RolagemDetalhes` | `DetailScroll` | Rolagem da tela de detalhes |
| `CaixaBanner` | `BackdropWrapper` | Faixa da imagem de fundo |
| `ImagemBanner` | `BackdropImage` | Imagem de fundo |
| `CorpoDetalhes` | `DetailBody` | Corpo da tela de detalhes |
| `TopoDetalhes` | `DetailTop` | Pôster + título sobrepostos |
| `PosterDetalhes` | `DetailPoster` | Pôster grande |
| `InfoTopoDetalhes` | `DetailTopInfo` | Título e ano ao lado do pôster |
| `TituloDetalhes` | `DetailTitle` | Título na tela de detalhes |
| `ResumoDetalhes` | `DetailMeta` | Ano e status |
| `EtiquetaTipo` | `TypeTag` | Selo FILME/SÉRIE |
| `TextoEtiquetaTipo` | `TypeTagText` | Texto do selo |
| `LinhaEtiquetas` | `ChipRow` | Linha das etiquetas de gênero |
| `Etiqueta` | `Chip` | Etiqueta de um gênero |
| `TextoEtiqueta` | `ChipText` | Nome do gênero |
| `Sinopse` | `Overview` | Texto da sinopse |
| `GradeInformacoes` | `InfoGrid` | Grade de informações técnicas |
| `CaixaInformacao` | `InfoBox` | Um bloco de informação |
| `RotuloInformacao` | `InfoLabel` | Rótulo ("Orçamento") |
| `ValorInformacao` | `InfoValue` | Valor ("US$ 1.500.000") |
| `LinhaAcoes` | `ActionRow` | Linha dos botões de ação |
| `BotaoPilula` | `PillButton` | Botão arredondado |
| `TextoBotaoPilula` | `PillButtonText` | Texto do botão arredondado |
| `LinhaEstrelas` | `StarsRow` | Linha das 5 estrelas |
| `BotaoEstrela` | `StarButton` | Cada estrela clicável |
| `TituloBloco` | `BlockTitle` | Título de bloco ("Sinopse", "Elenco") |
| `ListaElenco` | `CastList` | Lista horizontal do elenco |
| `ListaSimilares` | `SimilarList` | Lista horizontal dos similares |
| `CardAtor` | `CastCard` | Card de um ator |
| `FotoAtor` | `CastAvatar` | Foto redonda do ator |
| `NomeAtor` | `CastName` | Nome do ator |
| `PapelAtor` | `CastRole` | Personagem que ele faz |
| `CardSimilar` | `SimilarCard` | Card de um título similar |
| `PosterSimilar` | `SimilarPoster` | Pôster do similar |
| `NomeSimilar` | `SimilarName` | Nome do similar |
| `AnoSimilar` | `SimilarYear` | Ano e nota do similar |

> As props que servem só para o estilo também foram traduzidas: `$invalid` → `$invalido`,
> `$active` → `$ativo`, `$loading` → `$carregando`, `$score` → `$nota`,
> `$variant` → `$variante` (com os valores `danger` → `perigo` e `done` → `concluido`).
