# Meu Treino

Aplicação web em português para organizar treinos, acompanhar a rotina pré-treino e registrar a evolução das cargas. A interface é uma página única: as abas inferiores alternam telas dentro do próprio `index.html`, sem navegar para outros arquivos HTML.

## Arquivos do projeto

| Arquivo | Responsabilidade |
| --- | --- |
| [`index.html`](./index.html) | Estrutura da página, metadados, áreas de conteúdo, navegação, janelas de edição e importações. |
| [`style.css`](./style.css) | Tema visual, disposição dos componentes, estados ativos e adaptação a diferentes telas. |
| [`script.js`](./script.js) | Dados iniciais, persistência local, navegação, renderização, edição, registros de carga, instalação PWA e contador Firebase. |
| [`CONFIGURAR-CATALOGO-EXERCICIOS.md`](./CONFIGURAR-CATALOGO-EXERCICIOS.md) | Passo a passo para definir exercícios e mídias (vídeos ou GIFs) padrão do catálogo para todas as pessoas. |
| `4929985-training-icon-on-white-linear-style-vetor.jpg` | Imagem disponível no diretório. O HTML atual não a referencia; os ícones visíveis da interface são principalmente SVGs incorporados no próprio HTML. |

Não há um processo de compilação ou dependências locais definidos nesses arquivos. A página carrega as fontes e as bibliotecas Firebase por URLs externas.

## Como executar

Para testar localmente, sirva a pasta por HTTP, por exemplo:

```bash
python3 -m http.server 8000
```

Depois, abra `http://localhost:8000` no navegador. Servir por HTTP/HTTPS também é importante para testar corretamente recursos de instalação como PWA, que dependem de um contexto seguro. O comportamento de instalação varia conforme o navegador e o dispositivo.

## Estrutura do `index.html`

### Documento e idioma

- `<!DOCTYPE html>` declara o documento como HTML5.
- `<html lang="pt-BR">` informa que o idioma principal é português brasileiro. Isso ajuda leitores de tela, mecanismos de busca e recursos de tradução.
- `<head>` reúne metadados, título e recursos externos; `<body>` contém tudo que é exibido e manipulado pela aplicação.
- `<div id="app">` agrupa a interface e é usado como contêiner principal pelos estilos.

### Metadados (`meta`)

- `charset="UTF-8"` habilita acentos e outros caracteres Unicode.
- `name="viewport"` ajusta a largura à tela do dispositivo. `viewport-fit=cover` permite usar a área completa em aparelhos com recortes; `maximum-scale=1` limita o zoom máximo.
- `name="theme-color"` sugere aos navegadores móveis a cor escura da interface para elementos da moldura do navegador.
- `apple-mobile-web-app-capable` e `mobile-web-app-capable` indicam intenção de uso como aplicativo instalado.
- `apple-mobile-web-app-status-bar-style` e `apple-mobile-web-app-title` controlam, em navegadores Apple compatíveis, a aparência da barra de status e o nome exibido na tela inicial.
- `<title>` define o título da aba e o nome padrão usado pelo navegador.

### Links de recursos (`link` e o atributo `rel`)

O atributo `rel` descreve a relação do recurso indicado em `href` com o documento:

- `rel="manifest"` fornece os metadados de instalação da aplicação. Neste projeto, o manifesto está embutido em uma URL `data:` codificada em Base64, em vez de ser um arquivo separado. Ele define o nome “Meu Treino”, o nome curto “Treino”, a URL inicial relativa (`.`), modo de exibição `standalone` e cores de fundo/tema.
- `rel="apple-touch-icon"` fornece o ícone para a tela inicial de dispositivos Apple compatíveis. A imagem é igualmente incorporada como `data:image/png;base64,...`.
- `rel="icon"` define o favicon do navegador; também usa uma imagem PNG embutida. Os dois ícones são dados no próprio HTML e não dependem da imagem JPG listada no diretório.
- `rel="preconnect"` pede ao navegador que antecipe a conexão com `fonts.googleapis.com` e `fonts.gstatic.com`, reduzindo a espera pelas fontes. O `crossorigin` no segundo endereço prepara a conexão cross-origin necessária para o carregamento dos arquivos de fonte.
- `rel="stylesheet"` importa `style.css`; como o caminho é relativo, o arquivo deve permanecer ao lado de `index.html`.

### Fontes externas

O link do Google Fonts carrega as famílias **Barlow Condensed** (pesos 600, 700 e 800) e **Inter** (pesos 400 a 700). O CSS usa Inter como tipografia geral e Barlow Condensed em títulos. Se as fontes externas não carregarem, há fontes alternativas declaradas no CSS.

### Firebase no `<head>`

Dois scripts são carregados pelo CDNJS antes do código principal:

1. `firebase-app-compat.min.js`: núcleo da versão compatível do Firebase.
2. `firebase-firestore-compat.min.js`: integração compatível com Cloud Firestore.

O `script.js` depende do objeto global `firebase` que esses scripts disponibilizam. Na aplicação, o Firebase não armazena os treinos ou o histórico pessoal: é usado somente para ler e incrementar um contador agregado de aberturas/uso. O código aponta para o documento `stats/usage` e consulta/atualiza o campo `opens`. O contador pode não aparecer ou não incrementar se a conexão, o documento ou as regras de segurança do Firestore não permitirem a operação; as demais funções do app usam armazenamento local.

A configuração do projeto Firebase fica no início de `script.js`. Os valores de configuração enviados ao navegador identificam o projeto, mas não substituem as regras de segurança. As regras do Firestore devem restringir explicitamente as operações permitidas. As bibliotecas são externas, portanto requerem conexão com a internet.

### Mídias dos exercícios

No catálogo de exercícios, é possível escolher um arquivo MP4, JPG/JPEG, PNG ou GIF, ou continuar informando uma URL. Os arquivos escolhidos são guardados no IndexedDB do navegador; eles não são enviados ao Netlify nem ficam disponíveis em outros navegadores ou dispositivos. Limpar os dados do site no navegador também pode apagar esses arquivos. Para compartilhar uma mídia entre pessoas ou dispositivos, hospede-a em um serviço de arquivos e use sua URL.

### Cabeçalho (`header`)

`<header class="topbar">` é a barra superior fixa/aderente definida no CSS. Contém:

- a marca “MEU TREINO” e um SVG inline representando um halter;
- `#date-badge`, preenchido pelo JavaScript com o dia da semana e a data atual.

O HTML usa `header` como estrutura semântica de cabeçalho da aplicação; as classes controlam sua aparência, e o ID `date-badge` conecta o elemento à rotina de inicialização em `script.js`.

### Conteúdo principal (`main` e `section`)

`<main>` contém as telas principais. Cada `<section class="screen">` é uma tela da aplicação. O JavaScript ativa uma delas adicionando a classe `active`; o CSS esconde as demais. Os IDs precisam corresponder ao nome usado por `switchScreen()`, no formato `screen-NOME`.

#### `#screen-home` — Início

- Banner de instalação (`#install-banner`), com instruções e botão de instalação quando o navegador oferece suporte.
- Cartão de destaque do treino/dia de descanso, preenchido conforme a programação semanal.
- Botão para abrir a tela de treino.
- Checklist pré-treino e barra/legenda de progresso.
- Grade semanal e botão para editar a programação dos dias.

#### `#screen-workout` — Treino

- Botão para ligar/desligar o modo de gerenciamento.
- `#tabs-row`, preenchido dinamicamente com os tipos de treino nomeados (por exemplo, “Treino superior”).
- `#exercise-list`, preenchida com cartões de exercícios escolhidos do catálogo Pré-definidos.
- Ao tocar em um cartão, abre `#screen-exercise`, com opção de sair, imagem, registro individual em kg ou minutos e botão para concluir apenas aquele exercício.
- O gerenciamento permite criar, renomear e excluir tipos de treino; a edição do nome dos exercícios e do catálogo acontece em Pré-definidos.

#### `#screen-exercise` — Registro individual

- Botão para sair e retornar à lista sem salvar.
- Identificação do treino e exercício selecionados, ilustração e metadados de séries/repetições.
- Seletor entre carga (kg) e duração (minutos), campo numérico e ação para concluir apenas esse exercício.

#### `#screen-temporizador` — Temporizador de exercício

- Seletor de exercício preenchido com as atividades cadastradas nos treinos.
- Campos para definir minutos e segundos (de 1 segundo até 23h59m59s).
- Relógio circular que mostra o tempo restante em contagem regressiva e o tempo decorrido em contagem crescente.
- Controles para iniciar, pausar, continuar e zerar o temporizador.
- Ao terminar, mostra um aviso no app, vibra quando compatível e envia uma notificação do navegador se a pessoa ativar essa permissão.

#### `#screen-predefinido` — Catálogo de exercícios

- Catálogo para cadastrar e editar exercícios com séries, repetições, URL de mídia (vídeo ou GIF) e uma descrição curta da execução.
- Vídeos locais devem ficar em `videos/` e usar caminhos relativos, como `videos/agachamento.mp4`; não use endereços `localhost` no site publicado.
- No modo **Tipos de treino**, é possível adicionar exercícios do catálogo ou remover um exercício apenas do treino selecionado. Essa remoção não apaga o exercício de Pré-definidos.
- Os Treinos 1 e 2 começam vazios. Na primeira abertura da versão atualizada, os IDs dos exercícios padrão antigos (`a1`–`a6` e `b1`–`b7`) são removidos uma vez desses treinos, sem remover os itens do catálogo Pré-definidos. Exercícios personalizados existentes são preservados.
- A exclusão pela tela do catálogo remove o exercício também dos treinos em que foi usado.

#### `#screen-pretreino` — Pré-treino

- Checklist de rotina, compartilhado com o checklist da tela Início.
- Barra e texto de progresso.
- Modo de gerenciamento para adicionar, editar e excluir itens.
- Botão para reiniciar o checklist do dia.

#### `#screen-progress` — Progresso

- Seletor de exercício (`#progress-exercise-select`).
- Gráfico SVG e histórico completo de cargas; os dados são originados dos treinos concluídos e salvos localmente.
- Créditos do desenvolvedor e links externos de contato.

### Navegação inferior (`nav`)

`<nav class="bottom-nav">` mantém os três destinos principais: Início, Treino e Temporizador. Progresso, Rotina e Pré-definidos ficam no menu aberto pelo ícone da marca (`#brand-menu-toggle`), no cabeçalho. Cada opção associa:

- `data-screen="nome"` à tela correspondente;
- `onclick="switchScreen('nome')"` à função que alterna a tela;
- a classe `active` ao estado visual selecionado;
- um SVG inline como ícone.

O menu da marca fecha ao escolher uma tela, clicar fora dele ou pressionar Escape.

Essa navegação não abre outras páginas HTML: troca as seções dentro do mesmo documento e atualiza o botão ativo. O botão principal do cartão inicial usa `goToWorkoutFromHome()` para abrir Treino.

### Links externos

Na área de créditos, os links para WhatsApp (`wa.me`) e Instagram abrem em uma nova aba por causa de `target="_blank"`. `rel="noopener"` impede que a página aberta controle a aba de origem via `window.opener`. São links para serviços externos, não para telas locais do app.

### Notificações e modal

- `#toast` é uma área reutilizável para mensagens temporárias, por exemplo, confirmação de salvamento.
- `#modal-overlay` contém o formulário usado para incluir/editar itens pré-treino, exercícios e programação dos dias.
- Os grupos de campos têm IDs próprios e são mostrados ou escondidos de acordo com o tipo de modal. A grade de dias (`#day-toggle-grid`) também é montada pelo JavaScript.
- Os botões Cancelar, Salvar e Excluir chamam `closeModal()`, `saveModal()` e `deleteModalItem()`.

### Carregamento do JavaScript

`<script src="script.js"></script>` aparece no final do `<body>`. Assim, a estrutura HTML já existe quando o script procura elementos por ID e conecta os eventos. O caminho relativo pressupõe que `script.js` esteja na mesma pasta que `index.html`.

## O que fazem `style.css` e `script.js`

### `style.css`

`style.css` define o tema e a apresentação de todas as telas. As regras estão organizadas do geral para o específico: tokens e estrutura da página primeiro, estilos de cada componente em seguida e ajustes responsivos no final. A folha não implementa comportamento de dados; usa classes e elementos que o HTML cria ou que o `script.js` adiciona dinamicamente.

#### 1. Variáveis, reset e tipografia

O seletor `:root` declara propriedades personalizadas CSS para centralizar valores que se repetem:

| Variável | Uso |
| --- | --- |
| `--black`, `--black-2` | Fundo principal e superfície escura alternativa. |
| `--card`, `--card-2` | Fundos dos cartões e de elementos internos. |
| `--orange`, `--orange-dim` | Cor de destaque e variação mais escura. |
| `--blue`, `--blue-dim` | Azul de destaque e variação escura. |
| `--white`, `--gray`, `--gray-line` | Texto principal, texto secundário e bordas divisórias. |
| `--safe-top`, `--safe-bottom` | Áreas seguras superior/inferior do dispositivo, com fallback `0px`. |

O `box-sizing: border-box` global (`*`) faz com que padding e borda sejam incluídos nas dimensões declaradas dos elementos. `html` usa `scroll-padding-top` para considerar a área segura superior ao rolar.

`html, body` ocupam toda a altura, removem margens, usam o fundo preto, o texto branco e Inter como fonte principal, com fontes de sistema como fallback. `-webkit-tap-highlight-color: transparent` remove o realce padrão de toque em navegadores WebKit; `overscroll-behavior-y: none` evita o efeito de overscroll vertical do navegador. Cabeçalhos `h1`–`h3` e `.display` usam Barlow Condensed, peso 800 e margens zeradas. Botões herdam a fonte definida no documento.

#### 2. Contêiner do app, cabeçalho e área principal

- `#app` centraliza a aplicação, limita sua largura a 480 px e usa Flexbox em coluna para distribuir cabeçalho, conteúdo e navegação. Sua posição relativa também serve de referência para elementos posicionados.
- `header.topbar` tem gradiente escuro, borda inferior e `position: sticky` no topo, com `z-index: 10` para permanecer acima do conteúdo durante a rolagem. Flexbox alinha marca e data em lados opostos. O padding superior soma a margem visual à área segura do dispositivo.
- `.brand`, `.brand-mark` e `.brand-title` organizam a marca. O símbolo tem fundo laranja e tamanho fixo; o `span` no título realça “TREINO” em laranja.
- `main` ocupa o espaço restante (`flex: 1`), aplica margens internas e reserva espaço inferior para a navegação fixa e a área segura do aparelho.
- `.screen` oculta as telas por padrão e aplica uma animação de entrada. `.screen.active` torna visível a seção selecionada. `@keyframes fadein` anima opacidade e deslocamento vertical.

#### 3. Cartão inicial e títulos

- `.hero-card` cria o cartão de destaque com gradiente azul/escuro, borda, cantos arredondados e recorte de conteúdo.
- `.hero-card::after` desenha uma forma circular laranja translúcida como decoração, posicionada parcialmente para fora do cartão. O `overflow: hidden` impede que ela vaze.
- `.hero-eyebrow`, `.hero-title`, `.hero-sub` ajustam hierarquia, tamanhos e cores do texto. `.hero-title .accent` destaca em laranja o estado de descanso.
- `.hero-cta` apresenta o botão de ação principal como elemento flexível com fundo laranja. O estado `:active` reduz levemente sua escala durante o toque.
- `.usage-count` formata o indicador do contador Firebase como linha compacta com ícone e texto.
- `.section-title` estiliza títulos como “Semana” e “Evolução de carga”; `.section-title .bar` cria a pequena barra vertical laranja.
- `.section-title-row` alinha um título e um botão de gerenciamento na mesma linha. O título interno zera suas margens para caber nesse arranjo.

#### 4. Créditos e links de contato

`.dev-credit` separa os créditos por uma borda e centraliza o conteúdo. Os modificadores `.made-by` e `.dev-name` distinguem a legenda e o nome do desenvolvedor, este último usando Barlow Condensed. `.dev-links` distribui os links e permite quebra de linha em telas estreitas.

`.dev-link` apresenta WhatsApp e Instagram como pequenas cápsulas. Os modificadores `.wpp` e `.insta` aplicam cores e bordas próprias; os SVGs acompanham a cor de cada serviço. O estilo visual não altera os destinos nem o comportamento externo dos links.

#### 5. Checklist e indicador de conclusão

- `.checklist` empilha os itens com espaçamento constante.
- `.check-item` organiza caixa e texto em uma linha, adiciona fundo, borda, cantos arredondados e cursor de toque; `user-select: none` evita seleção acidental do texto.
- `.check-item.done` altera fundo e borda para indicar conclusão. Nesse estado, a caixa `.check-box` fica laranja e o SVG que representa a marcação é exibido; por padrão, esse SVG fica oculto.
- `.check-text` ocupa o espaço flexível restante; `.check-time`, `.check-label` e `.check-detail` definem hierarquia visual para horário, nome e descrição. O nome concluído recebe risco e cor secundária.
- `.progress-strip` forma a trilha da barra, com conteúdo recortado; `.progress-strip-fill` pinta o preenchimento em gradiente e anima alterações de largura.
- `.progress-label` mostra a contagem concluída em texto secundário.

#### 6. Abas e controles de treino

- `.tabs-row` coloca as abas lado a lado. `.tab-pill` distribui a largura, centraliza o rótulo e indica o estado selecionável. `.tab-pill.active` usa fundo e borda laranja para mostrar o treino selecionado.
- `.tab-pill-wrap` permite posicionar os controles de gerenciamento do tipo de treino. `.workout-type-edit` abre a edição do nome, `.tab-del` remove o tipo (mantendo seus registros históricos), e `.tab-add` cria um tipo com nome livre.
- `.exercise-card` é o cartão selecionável de cada exercício. `.exercise-head` alinha nome e metadados; `.exercise-name` e `.exercise-meta` separam destaque do nome e informação compacta de séries/repetições. `.exercise-open-hint` mostra o estado individual e o último registro.
- `.exercise-detail-card` contém os dados e controles do exercício selecionado; `.exercise-detail-image` exibe uma imagem/GIF ou ilustração alternativa, `.exercise-detail-video` exibe vídeos e `.exercise-detail-workout` identifica o treino associado.
- `.exercise-detail-description` mostra a orientação cadastrada no catálogo para a execução do exercício.
- `.load-input-wrap` agrupa o campo numérico e a unidade. O seletor permite registrar carga em kg ou duração em minutos; `.exercise-exit` volta à lista sem concluir, e `.exercise-complete-btn` salva somente o exercício aberto.
- `.last-load` e `.last-load b` estilizam a indicação do último registro.
- `.predefined-exercise-card` apresenta os exercícios do catálogo, incluindo a prévia de vídeo/GIF ou um aviso quando a mídia não está disponível. `.gif-url-group` destaca o campo de URL da mídia no formulário.
- `.timer-card` e `.timer-duration` organizam os controles do temporizador. `.timer-clock` desenha o relógio circular, cuja borda acompanha o progresso; `.timer-actions` alinha os controles de iniciar/pausar e zerar; `.timer-notification-btn` ocupa a largura disponível para ativar os avisos de conclusão.
- `.btn-primary` é o botão principal laranja, em largura total, com sombra e letras maiúsculas; `.btn-secondary` é a alternativa azul contornada. Ambos têm dimensões e pesos tipográficos adequados a controles de toque. `.modal-actions .btn-primary` remove a sombra dentro do modal.

#### 7. Grade semanal e seleção de exercício

`.week-grid` usa CSS Grid com sete colunas iguais. `.week-day` desenha cada dia em formato quadrado (`aspect-ratio: 1`), centralizando abreviação e treino. `.week-day.a` e `.week-day.b` atribuem cores diferentes conforme a classe calculada pelo JavaScript; `.week-day.today` envolve o dia atual com um contorno interno branco.

`.select-wrap` fornece o contêiner do seletor de exercício. A regra global `select` deixa o controle ocupar a largura total, com fundo transparente e tipografia do app; `select option` define cores das opções. Essas regras são usadas na tela Progresso.

#### 8. Cartão de gráfico, vazio e tabela histórica

`.chart-card` cria o cartão que contém o SVG do gráfico; `.chart-title` apresenta sua legenda. `.empty-state` centraliza a mensagem exibida quando ainda não há registros.

`.history-table` ocupa a largura do cartão e usa bordas colapsadas. Cabeçalhos (`th`) ficam em caixa alta, cor secundária e com divisória inferior; células (`td`) recebem espaçamento e linhas separadoras. A última linha remove a borda inferior.

#### 9. Navegação fixa, toast e banner de instalação

- `nav.bottom-nav` fica fixa no rodapé da viewport, limitada à largura do app. Tem fundo escuro semitransparente, desfoque de fundo, borda superior e `z-index: 20`; o padding inferior inclui a área segura do dispositivo.
- `.nav-btn` divide igualmente o espaço da navegação inferior, empilhando ícone e rótulo. `.brand-menu` apresenta as outras telas em uma lista compacta ancorada ao ícone da marca; `.brand-menu-btn.active` destaca a tela selecionada.
- `.toast` é uma cápsula fixa acima da navegação, centralizada horizontalmente. Começa transparente e deslocada para baixo; `.toast.show` restaura opacidade e posição com transição. Seu `z-index: 40` a mantém acima dos conteúdos.
- `.install-banner` fica oculto por padrão; `.install-banner.show` o exibe. O contorno laranja o diferencia do conteúdo. Título, explicação e botão têm tamanhos próprios, e `.dismiss-x` posiciona visualmente o controle de fechar no topo do banner.

#### 10. Gerenciamento de listas e ações por item

- `.manage-btn` apresenta ações como “Gerenciar” e “Editar dias” em formato de cápsula; `.manage-btn.active` muda para laranja para indicar o modo ativo.
- `.item-actions` alinha os controles de um item e evita que encolham.
- `.icon-btn` define os botões quadrados de editar e excluir. Os SVGs de `.edit` ficam azuis e os de `.delete` vermelhos; `:active` reduz o botão durante a interação.
- `.check-item.manage-mode` e `.exercise-card.manage-mode` removem o cursor de clique do cartão no modo em que os controles individuais assumem a ação.
- `.add-card` desenha os controles de adição com borda tracejada e ícone; o estado `:active` realça o fundo.

#### 11. Modal de edição

`.modal-overlay` cobre a viewport com fundo preto translúcido, alinha a folha inferior e fica oculto até receber `.show`. Seu `z-index: 50` coloca-o acima dos demais componentes.

`.modal-sheet` limita a largura a 480 px, usa fundo escuro, cantos arredondados no topo e padding inferior que considera a área segura. `@keyframes slideup` anima sua entrada de baixo para cima.

Os estilos `.modal-title`, `.field-group`, `.field-label` e `.field-input` formatam título, agrupamento, rótulos e campos. O foco do campo (`:focus`) muda a borda para laranja. `.field-row` organiza campos lado a lado; `.field-row .field-group` divide o espaço. `.modal-actions` organiza Cancelar/Salvar; `.btn-delete` destaca a ação destrutiva em vermelho.

Para a programação semanal, `.day-toggle-grid` desenha sete colunas e `.day-toggle` cria os quadrados clicáveis dos dias. Os modificadores `.day-toggle.a` e `.day-toggle.b` diferenciam os treinos com preenchimentos translúcidos laranja e azul. `.field-hint` exibe a instrução abaixo da grade.

#### 12. Regras responsivas e prevenção de overflow

O bloco `@media (max-width: 359px)` adapta a interface a telas muito estreitas: reduz paddings e tamanhos de títulos, textos, dias, abas e botões de carga; a linha de campos do modal passa a ser uma coluna para evitar compressão.

O bloco `@media (min-width: 640px)` trata tablets e desktop como um cartão de aplicativo centralizado: muda o fundo externo, centraliza `#app` com margens, mantém sua largura compacta, adiciona cantos arredondados, borda e sombra. O cabeçalho e a navegação também recebem cantos compatíveis com o contêiner.

Em `@media (max-height: 480px) and (orientation: landscape)`, os paddings do cabeçalho e da navegação diminuem e o espaço reservado abaixo do conteúdo é reduzido para aproveitar a altura limitada de um celular deitado.

Por fim, `html, body { overflow-x: hidden; }` evita rolagem horizontal, enquanto `img, svg { max-width: 100%; }` impede que imagens ou ícones excedam a largura disponível.

#### Classes de estado controladas pelo JavaScript

As classes abaixo fazem a ponte entre lógica e visual:

| Classe | Efeito visual e elemento relacionado |
| --- | --- |
| `.screen.active` | Mostra a seção ativa da navegação. |
| `.nav-btn.active` | Destaca a aba atual no rodapé. |
| `.check-item.done` | Marca uma etapa como concluída e revela o ícone de check. |
| `.tab-pill.active` | Destaca o treino selecionado. |
| `.manage-btn.active` | Indica modo de gerenciamento ligado. |
| `.manage-mode` | Ajusta o cursor dos cartões enquanto se exibem ações de item. |
| `.week-day.a` / `.week-day.b` | Diferencia visualmente os treinos da grade semanal. |
| `.day-toggle.a` / `.day-toggle.b` | Indica o treino selecionado em cada dia no modal. |
| `.modal-overlay.show` | Abre a camada do modal. |
| `.toast.show` | Exibe a notificação temporária. |
| `.install-banner.show` | Exibe o banner de instalação. |

### `script.js`

`script.js` concentra os dados e a lógica da aplicação. Ele é carregado no fim do `<body>`, portanto pode localizar diretamente os elementos do HTML por seus IDs. Abaixo estão detalhadas as principais partes, na ordem em que aparecem no arquivo.

#### 1. Contador de uso com Firebase

O primeiro bloco inicializa um contador agregado no Cloud Firestore:

- `FIREBASE_CONFIG` contém os dados públicos de identificação do projeto Firebase usados pelo SDK no navegador.
- `USAGE_DOC_PATH` define o caminho do documento: coleção `stats`, documento `usage`.
- `USAGE_COUNTED_KEY` é a chave local que indica se aquele navegador já registrou uma abertura.
- `usageCounterConfigured()` verifica se existe uma chave de configuração utilizável.
- `initUsageCounter()` inicializa o Firebase (sem inicializá-lo novamente se já houver uma instância), obtém o Firestore e inicia a leitura e a tentativa de contabilização.
- `loadUsageCount()` busca o documento, lê `opens` e preenche `#usage-count-text`/exibe `#usage-count-wrap` apenas se o documento e os elementos existirem.
- `trackOpenIfNeeded()` evita contabilizar novamente no mesmo navegador quando a chave local já está marcada. Caso contrário, pede ao Firestore para incrementar `opens` em uma unidade e, após sucesso, grava a marca local e atualiza a contagem exibida.

Erros do contador são enviados ao console com `console.warn`; não impedem a inicialização das demais áreas. A contabilização pressupõe que o documento já exista e que as regras do Firestore permitam as operações solicitadas. Os treinos, checklists e históricos não são enviados a esse documento: permanecem no armazenamento local.

#### 2. Dados padrão e convenções

- `DEFAULT_WORKOUTS` cria os treinos iniciais A e B vazios. Para adicionar exercícios, use **Tipos de treino** na tela Treino e escolha itens do catálogo Pré-definidos.
- `DEFAULT_PRETREINO_ITEMS` contém os itens iniciais da rotina. Cada item usa `id`, `time`, `label` e `detail`.
- `WEEKDAYS` associa os índices numéricos usados por `Date.getDay()` às abreviações dos dias: domingo é `0`, segunda é `1`, até sábado `6`.

Os dados padrão são usados quando não existe uma versão salva no navegador. Alterações feitas pelo usuário substituem o estado em memória e são persistidas; não alteram os valores constantes de padrão no arquivo.

#### 3. Estado e armazenamento local

`STORE_KEY` é a chave `meutreino_state_v1` em `localStorage`. A variável global `state` é o objeto central em memória, carregado por `loadState()` e salvo por `saveState()`.

O estado reúne estes campos:

| Campo | Conteúdo |
| --- | --- |
| `workouts` | Objeto com os exercícios agrupados por identificador de treino, como `A` e `B`. |
| `workoutOrder` | Ordem das abas e IDs internos dos tipos de treino. |
| `workoutNames` | Nomes apresentados para os tipos de treino; IDs antigos, como A/B, continuam servindo apenas como chaves internas. |
| `predefinedExercises` | Catálogo central de exercícios, com séries, repetições, URL do GIF e instruções de execução. |
| `pretreino` | Lista editável dos itens da rotina pré-treino. |
| `checklist` | Mapa de IDs de itens para valores booleanos que indicam conclusão. |
| `checklistDate` | Data local associada às marcações atuais do checklist. |
| `daySchedule` | Mapa dos dias da semana para o identificador do treino ou `null` (descanso). |
| `trainDows` | Lista legada de dias de treino, usada somente para migrar dados antigos que ainda não tenham `daySchedule`. |
| `logs` | Histórico por exercício; cada entrada inclui ID/nome do exercício, treino, valor, unidade (`kg` ou `min`) e data. Registros antigos com `kg` continuam compatíveis. |
| `lastWorkout` | Identificador do último treino marcado como concluído. |
| `installDismissed` | Preferência para não voltar a mostrar o banner de instalação dispensado. |

`loadState()` tenta ler e interpretar o JSON salvo. Se a leitura falhar, registra um aviso no console; se não houver estado, cria um estado inicial mínimo. Em seguida, preenche propriedades ausentes com os padrões atuais. Isso permite completar estados antigos sem descartar os campos que já existem.

Há uma migração simples de programação semanal: se o estado não tiver `daySchedule`, a função cria sete dias vazios e distribui os dias guardados em `trainDows` entre os treinos disponíveis, em ordem. `generateId()` cria IDs para novos itens com base no horário atual e em uma sequência aleatória.

`saveState()` converte o objeto `state` inteiro em JSON e grava-o em `localStorage`. Se o armazenamento estiver indisponível ou exceder a quota do navegador, o erro é registrado com `console.warn`. Como é armazenamento do navegador, os dados não são compartilhados entre navegadores ou dispositivos e podem ser removidos ao limpar os dados do site.

#### 4. Data atual e reinício diário

- `todayStr()` retorna a data local no formato `AAAA-MM-DD`, usado para comparar dias e associar os registros de carga.
- `todayLabel()` retorna a abreviação do dia da semana e a data no formato visual `DIA · DD/MM`.

Durante a execução do script, antes da inicialização da interface, compara-se `state.checklistDate` com `todayStr()`. Se forem diferentes, apaga-se o mapa de itens concluídos, atualiza-se a data e salva-se o estado. Isso reinicia somente as marcações do checklist; os itens e o histórico de cargas permanecem.

#### 5. Navegação entre telas

- `switchScreen(name)` remove `active` de todas as `.screen`, ativa `#screen-NOME`, atualiza os botões `.nav-btn` e `.brand-menu-btn` com base em `data-screen`, fecha o menu da marca e rola a página ao topo.
- `goToWorkoutFromHome()` abre a tela `workout` a partir do cartão da tela inicial e sincroniza o botão da navegação.

Essas funções alteram classes no documento atual. Não fazem requisições nem carregam outras páginas HTML.

#### 6. Modos de gerenciamento

`manageModePretreino` e `manageModeWorkout` são estados temporários em memória: controlam se cada lista mostra suas ações de edição e exclusão.

`toggleManageMode(scope)` alterna o modo correspondente, aplica a classe visual `active` ao botão e redesenha a lista afetada. O modo não é guardado em `localStorage`; ao recarregar a página, começa desligado.

#### 7. Checklist pré-treino

`renderChecklist(containerId, fillId, labelId)` é reutilizada para desenhar o mesmo checklist em dois lugares: a tela inicial e a tela Pré-treino. Recebe os IDs do contêiner, da barra de progresso e do texto de progresso.

Para cada item de `state.pretreino`, a função:

1. consulta `state.checklist[item.id]` para saber se foi concluído;
2. cria o elemento e aplica as classes `check-item`, `done` e, quando aplicável, `manage-mode`;
3. no modo normal, associa um clique que alterna a conclusão, salva o estado e redesenha as duas cópias do checklist;
4. no modo de gerenciamento da tela Pré-treino, apresenta os controles para editar ou excluir, sem tratar o toque no cartão como conclusão.

Se o modo de gerenciamento estiver ativo, também acrescenta um cartão para criar um item. Por fim, calcula o número concluído e a porcentagem e atualiza a barra e o rótulo correspondentes.

- `resetChecklist()` limpa todas as marcações do dia, persiste e atualiza os dois checklists.
- `confirmDeletePretreino(id)` remove o item da lista e sua marcação de conclusão, salva e redesenha ambos os locais.

#### 8. Grade semanal e programação

`renderWeekGrid()` calcula a segunda-feira da semana atual e monta sete cartões de segunda a domingo. Para cada dia, consulta `state.daySchedule` usando o índice de `Date.getDay()`, mostra o nome do tipo de treino ou `—` para descanso e marca o dia atual com a classe `today`.

A seleção/edição da programação é feita pelo modal e descrita adiante. A grade semanal é uma visualização; a edição ocorre no botão “Editar dias” da tela Início.

#### 9. Abas e exercícios

`activeWorkoutTag` guarda o treino selecionado na tela. As funções auxiliares relacionadas à programação e às abas são:

- `tagParityClass(tag)` alterna as classes visuais `a` e `b` conforme a posição do treino em `workoutOrder`.
- `getNextWorkoutTag()` procura, começando pelo dia atual, o próximo treino programado nos sete dias seguintes. Se nenhum dia válido estiver programado, usa o primeiro treino da ordem.
- `isRestDayToday()` identifica se o dia atual está sem treino ou aponta para um treino que já não existe.
- `getWorkoutName(tag)` resolve o rótulo apresentado para o ID interno do tipo.
- `renderTabs()` reconstrói `#tabs-row`, mostra os nomes dos tipos e, no modo de gerenciamento, controles para renomear, excluir e criar tipos.
- `openModal("workoutType", id)` e `saveModal()` criam ou renomeiam tipos com um nome informado pela pessoa; IDs internos não dependem desse nome.
- `confirmDeleteWorkoutTag(tag)` impede que o último tipo seja removido. Ao excluir outro, limpa referências da programação semanal, escolhe um tipo válido se necessário e atualiza as áreas dependentes. Os nomes antigos são preservados para identificar os registros históricos.
- `setWorkoutTab(tag)` muda o treino ativo e redesenha abas e exercícios.
- `getLastLoad(exId)` localiza o registro mais recente daquele exercício na lista de logs.

`renderExerciseList()` constrói os cartões do tipo ativo. Os exercícios podem ser abertos para registro individual; no modo de gerenciamento, a pessoa escolhe exercícios existentes no catálogo Pré-definidos. Não há controles para criar ou editar exercícios nessa tela.

- `openExerciseDetail(exId, workoutTag)` abre a tela do exercício e carrega seus dados e registro anterior; `closeExerciseDetail()` retorna sem concluir.
- `completeCurrentExercise()` exige um valor positivo, salva ou atualiza o registro daquele exercício/treino/data e atualiza a lista e o progresso. Não conclui os outros exercícios nem o treino inteiro.

#### 10. Cartão da tela inicial

- `updateHeroCard()` consulta `isRestDayToday()` e `getNextWorkoutTag()` para mostrar treino do dia ou descanso. Em dia de descanso, também exibe o próximo dia programado, quando houver.
- `nextScheduledDayLabel()` procura a próxima programação depois de hoje e devolve o treino e a abreviação do dia, ou `null` se não houver.
- `renderHome()` atualiza o cartão e seleciona o próximo treino nas abas e na lista de exercícios.

#### 11. Gráfico e histórico de progresso

- `renderProgressSelect()` reúne exercícios de todos os treinos, recria as opções de `#progress-exercise-select` e tenta manter selecionado o exercício anterior se ele ainda existir. Em seguida, atualiza gráfico e histórico.
- `formatDate(dstr)` converte `AAAA-MM-DD` para `DD/MM` para exibição.
- `renderProgressChart()` filtra `state.logs` pelo exercício e pela unidade mais recente. Sem registros, mostra uma mensagem vazia e limpa a tabela. Com registros, calcula pontos em um SVG de dimensões fixas, desenha uma linha, área em degradê, pontos e rótulo do valor mais recente. Também monta a tabela do histórico em ordem cronológica inversa (mais recente primeiro).

O gráfico é desenhado pelo próprio código, sem biblioteca de gráficos adicional. A unidade apresentada corresponde aos registros (kg ou minutos), e os dados são salvos localmente ao concluir cada exercício.

#### 12. Modal para criação, edição e programação

`modalState` guarda o tipo de formulário aberto, o ID do item (se houver) e o treino associado. `tempDaySchedule` é uma cópia temporária da programação enquanto o modal de dias está aberto.

- `openModal(type, id, workoutTag)` configura a visibilidade dos grupos de campos e o título conforme o tipo (`pretreino`, `exercise` ou `weekdays`). Para edição, carrega os valores existentes; para programação, copia `state.daySchedule` para `tempDaySchedule` e desenha a grade.
- `openWeekdaysModal()` é o atalho chamado pelo botão “Editar dias”.
- `renderDaySchedulePicker()` mostra os sete dias. Cada toque avança ciclicamente entre os treinos disponíveis e, após o último, volta para descanso (`null`). A alteração ainda é temporária até salvar.
- `closeModal()` apenas esconde a janela; se as alterações não foram salvas, a cópia temporária não substitui a programação persistida.
- `saveModal()` trata separadamente a programação e os itens. Para dias, copia `tempDaySchedule` ao estado, persiste e atualiza semana e Início. Para os outros tipos, exige um nome não vazio. Itens pré-treino salvam horário, nome/label e detalhes; exercícios salvam nome, séries e repetições. Conclui atualizando as listas e componentes afetados.
- `deleteModalItem()` encaminha a exclusão para a função correta de pré-treino ou exercício e fecha o modal.

Séries usam `parseInt()` com valor padrão 3 quando o campo não fornece um número válido; repetições usam o texto informado ou `10` como padrão. O modal não é usado para editar as cargas registradas.

#### 13. Mensagens temporárias

`showToast(msg)` escreve a mensagem em `#toast`, ativa a classe `show` e programa a remoção após 2,2 segundos. Se outra mensagem for exibida antes, cancela o temporizador anterior para reiniciar a duração.

#### 14. Instalação como aplicativo

- `deferredPrompt` mantém o evento de instalação do navegador enquanto a página está aberta.
- O listener de `beforeinstallprompt` impede o comportamento automático, guarda o evento, mostra o botão e exibe o banner se o usuário ainda não o dispensou.
- `tryInstall()` solicita a instalação quando há um evento guardado e, ao concluir a escolha do usuário, limpa o evento e esconde o banner.
- `dismissInstallBanner()` esconde o banner, grava `installDismissed` no estado e salva essa preferência.
- `isStandalone()` detecta execução em modo instalado, consultando `display-mode: standalone` e a propriedade legada do Safari.
- `isiOS()` identifica iPhone, iPad ou iPod pelo `userAgent`.
- A função de inicialização imediata do banner não mostra instruções se o app já estiver instalado ou se o usuário dispensou o banner. Em iOS, apresenta instruções manuais do Safari; em navegadores compatíveis com `beforeinstallprompt`, a exibição é controlada pelo evento.

O manifesto e esse código preparam a instalação, mas não implementam funcionamento offline: o projeto não registra service worker.

#### 15. Inicialização da aplicação

O último bloco do arquivo executa a configuração inicial nesta ordem:

1. escreve a data em `#date-badge`;
2. renderiza o checklist da tela Início;
3. renderiza o checklist da tela Pré-treino;
4. constrói a grade semanal;
5. atualiza o cartão inicial e os exercícios do próximo treino;
6. monta o seletor, o gráfico e o histórico de progresso;
7. inicializa o contador de uso Firebase.

Como esse bloco fica no fim do script, os elementos do HTML já estão disponíveis. A função de instalação também configura seu listener e suas instruções durante a avaliação do script.

## Como as telas e arquivos se conectam

1. O navegador abre `index.html`.
2. Os recursos remotos (fontes e bibliotecas Firebase) e o `style.css` são carregados conforme seus `link` e `script`.
3. Ao final do corpo, `script.js` lê/cria o estado local, preenche os elementos marcados com IDs e liga a interação da aplicação.
4. Os botões da navegação chamam funções JavaScript que alternam as seções `screen-*`; controles adicionais chamam funções de edição e gravação.
5. O CSS aplica o estilo às classes do HTML original e às classes/elementos adicionados dinamicamente pelo script.
6. Links de navegação permanecem na página; apenas os links de contato abrem destinos externos.

Ao alterar IDs de elementos no HTML, atualize também as referências correspondentes em `script.js`. Ao renomear os arquivos locais, ajuste os caminhos relativos nos links de importação.
