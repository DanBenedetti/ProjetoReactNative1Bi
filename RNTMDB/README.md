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
  **AsyncStorage**, usado com as mesmas chaves e o mesmo padrão do projeto
  desenvolvido em sala (`GitViewer`).
- **Campo "Usuário" do LOGIN**: como o cadastro não possui campo de nome de usuário,
  o login usa o **e-mail** cadastrado.
- **Campo "Senha" no cadastro**: o PDF define os campos do cadastro (Nome, Telefone, CPF,
  E-mail, Curso) mas exige uma **senha** na tela de LOGIN. Para que o login funcione, o
  formulário de cadastro também coleta uma **Senha** (mínimo de 6 caracteres).
- **"Status" do card**: atendido com o campo **`status` da própria API do TMDb**
  (`Released` → "Lançado", `Returning Series` → "Em exibição", `Canceled` → "Cancelado").
  Como a busca e os destaques não retornam esse campo, ao tocar em **ADD** o app consulta
  os **detalhes completos** do título antes de salvar o card.

---

## 2. API utilizada: TMDb

- Documentação: <https://developer.themoviedb.org/docs/getting-started>
- Base: `https://api.themoviedb.org/3`
- Autenticação: **API Key v3** (parâmetro `api_key`)
- Idioma: todas as requisições usam `language=pt-BR` (títulos, sinopses e gêneros em português)

| Endpoint | Para que serve no app |
|----------|----------------------|
| `GET /trending/all/week` | Alimenta a aba **Destaques** (feed inicial, com paginação) |
| `GET /search/multi` | Barra de busca, procurando filmes e séries ao mesmo tempo |
| `GET /movie/{id}` e `GET /tv/{id}` | Detalhes completos de um filme ou série |
| `append_to_response=credits,similar` | Traz **elenco** e **títulos similares** na mesma requisição |

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
2. Acesse **Configurações → API** e clique em **Request an API Key** (opção **Developer**;
   use `Educational` como tipo de uso — a aprovação é imediata)
3. Copie a **API Key (v3 auth)** na página de configurações (não confunda com o
   *API Read Access Token*, que é a credencial v4)

> Faça esse cadastro pelo navegador do computador — o processo não é otimizado para celular.

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
5. **VER DETALHES** → sinopse, elenco, similares, notar com estrelas
6. Toque no ícone **☀️/🌙** no cabeçalho para alternar o tema claro/escuro

---

## 4. Estrutura do projeto

A organização segue a do projeto feito em aula (`GitViewer`), com pastas e arquivos em
inglês (`pages/`, `styles.js`, `login.js`...) e o código interno em português.

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

---

## 5. Funcionalidades extras (além do exigido)

- **Feed inicial de destaques** (trending do TMDb) com *pull-to-refresh* e paginação infinita
- **Abas de organização**: Destaques, Quero assistir, Assistidos e Favoritos
- **Tema claro/escuro** estilo cinema, com a escolha salva no aparelho
- **Tela de detalhes completa**: sinopse, elenco com fotos e títulos similares
- **Nota pessoal de 1 a 5 estrelas** por título, além da nota do TMDb
- **Validação real** de CPF (com dígitos verificadores), telefone (DDD e nono dígito),
  e-mail e senha, com máscaras aplicadas durante a digitação
- **Tratamento de erros** de rede e de API Key com mensagens em português

---

## 6. Dependências principais

| Biblioteca | Uso |
|------------|-----|
| `expo` / `react-native` | Base do app |
| `@react-navigation/native` + `@react-navigation/stack` | Navegação em pilha |
| `axios` | Requisições HTTP ao TMDb |
| `@react-native-async-storage/async-storage` | Persistência local (usuário, cards e tema) |
| `styled-components` | Estilização (mesmo padrão do projeto da aula) |
| `@expo/vector-icons` | Ícones (MaterialIcons) |
