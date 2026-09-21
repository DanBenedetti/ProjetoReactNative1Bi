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
| 3 | **CARDS** — busca os dados na API e cria cards com imagem, nome e **status**; botões ADD, EXCLUIR e VER MAIS DETALHES | `src/pages/main.js` |
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
5. **VER MAIS DETALHES** → sinopse, elenco, trailer, similares, notar com estrelas
6. Toque no botão **🎲 O que assistir?** para sortear um título
7. Toque no ícone **☀️/🌙** no cabeçalho para alternar o tema claro/escuro

---

## 4. Estrutura do projeto

A organização segue a do projeto feito em aula (`GitViewer`):

```
RNTMDB/
├── App.js                        # Providers (tema + biblioteca) e NavigationContainer
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
- **🎲 Roleta "O que assistir hoje?"**, que sorteia um título da lista do usuário
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
- **FAB**: o botão flutuante "O que assistir?" segue o padrão *Floating Action Button*
  (fixo no canto inferior direito, com ação primária).
- **Superfícies e cantos**: raios de canto consistentes (8–16 px) e separação de
  conteúdo por superfícies (`surface` / `surfaceAlt`) em vez de linhas pesadas.

---

## 6. Solução de problemas

| Sintoma | Causa provável / solução |
|---------|--------------------------|
| Aviso "API Key do TMDb não configurada" | O arquivo `.env` está vazio. Cole a chave e rode `npx expo start --clear` |
| "API Key inválida ou expirada" | A chave foi copiada errada ou é um *token v4* em vez da *API Key v3* |
| Cards não aparecem em Destaques | Verifique a internet do aparelho; use o botão **Tentar novamente** |
| Alterei o `.env` mas o aviso da API Key continua aparecendo | O Metro guarda em cache a transformação dos arquivos e **não** invalida esse cache quando o `.env` muda — a chave antiga (vazia) continua no bundle. Reinicie com `npx expo start --clear` |
