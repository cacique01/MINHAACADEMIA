# Documentação detalhada do código

Este documento explica a estrutura e o funcionamento do HTML, JavaScript e CSS do **Meu Treino**. As referências usam os números de linha dos arquivos no momento da criação deste guia. Linhas em branco separam blocos; chaves `{}` delimitam elementos HTML, objetos JavaScript, funções e regras CSS. Quando uma estrutura é repetida (por exemplo, cada exercício padrão ou cada botão da navegação), a explicação identifica os campos e o comportamento comuns a todas as repetições.

## Visão geral

- [`index.html`](./index.html) define o documento, as telas, os controles e os identificadores que o JavaScript atualiza.
- [`script.js`](./script.js) inicializa os dados, guarda o estado no navegador, implementa navegação e ações e atualiza o DOM.
- [`style.css`](./style.css) fornece cores, tipografia, dimensões, estados visuais e regras responsivas.
- O estado geral do aplicativo é guardado em `localStorage`. Os arquivos de mídia escolhidos no catálogo são armazenados separadamente no IndexedDB, no mesmo navegador e dispositivo. Eles não são enviados ao Netlify.
- Os números de linha podem mudar quando o código for editado. Use a seção e os nomes de função/seletor para localizar o trecho caso isso aconteça.

---

# 1. `index.html`

O HTML tem 326 linhas. Elementos de abertura criam controles e contêineres; seus elementos de fechamento encerram esses mesmos blocos. IDs são os pontos de ligação com o JavaScript; classes são usadas principalmente pelo CSS.

## Documento e recursos externos — linhas 1–23

| Linhas | Explicação |
|---|---|
| 1 | `<!DOCTYPE html>` pede ao navegador o modo padrão de interpretação HTML5. |
| 2 | Abre o documento e declara português brasileiro para acessibilidade, leitor de tela e ferramentas de idioma. |
| 3–23 | Abre o cabeçalho, que contém metadados e recursos, e o fecha na linha 23. |
| 4 | Define a codificação UTF-8, necessária para acentos e caracteres portugueses. |
| 5 | Configura a largura móvel conforme a tela e a área segura do aparelho. `maximum-scale=1` limita o zoom máximo. |
| 6 | Define o título da aba/aplicativo. |
| 7–11 | Informam a cor da interface e metadados usados para a experiência de instalação em dispositivos móveis/Apple. |
| 12 | Inclui um manifesto PWA em uma URL `data:` Base64: os metadados do aplicativo estão embutidos no HTML, sem arquivo separado. |
| 13–14 | Incluem ícones PNG embutidos em Base64 para a tela inicial e o favicon; os dados longos são a imagem, não código executável. |
| 15–16 | `preconnect` antecipa conexão com os servidores de fontes; `crossorigin` prepara a conexão cross-origin de fontes. |
| 17 | Solicita ao Google Fonts as famílias Barlow Condensed e Inter e seus pesos. |
| 19 | Carrega `style.css`, que deve ficar no mesmo diretório deste HTML. |
| 21–22 | Carregam, pelo CDNJS, Firebase App e Firestore na versão compatível com a API global `firebase` usada em `script.js`. |
| 23 | Fecha o cabeçalho. |

## Casca da aplicação e cabeçalho — linhas 24–38

| Linhas | Explicação |
|---|---|
| 24 | Abre o corpo visível da página. |
| 25 | Cria `#app`, contêiner geral cuja largura e disposição são controladas pelo CSS. |
| 27–35 | Cria o cabeçalho fixo/aderente. A marca é composta de um ícone SVG e o texto “MEU TREINO”. |
| 28–32 | Define a marca. O `<svg>` e `<path>` desenham o halter; `viewBox`, `stroke` e `stroke-width` controlam a área e o traço. |
| 33 | Reserva `#date-badge`; o JavaScript escreve ali o dia e a data atual. O estilo inline controla tipografia, cor e capitalização. |
| 35 | Fecha o cabeçalho. |
| 37–38 | Abre a área semântica principal que contém as telas. |

## Tela Início — linhas 39–76

| Linhas | Explicação |
|---|---|
| 39 | Comentário que identifica a seção Início; comentários não são exibidos. |
| 40 | Cria a tela `#screen-home`. A classe `active` faz dela a tela inicial visível. |
| 41–46 | Banner opcional de instalação PWA: botão de dispensar, título, texto e botão de instalação. O JavaScript só mostra o botão de instalar quando o navegador suporta o evento correspondente. |
| 42 | O clique chama `dismissInstallBanner()`. `&times;` é o caractere ×. |
| 44 | Texto que recebe instruções específicas por plataforma quando necessário. |
| 45 | O clique chama `tryInstall()`; o estilo inline mantém o botão inicialmente oculto. |
| 48–60 | Cartão principal do treino do dia. Seus textos iniciais são conteúdo provisório; `script.js` altera treino/descanso, resumo e ação conforme a programação. |
| 49–51 | Texto indicativo, título dinâmico do treino e subtítulo dinâmico. O trecho `<span class="accent">` destaca parte do título. |
| 52–55 | Botão que chama `goToWorkoutFromHome()` e abre a tela de treino; o SVG desenha uma seta. |
| 56–59 | Contador agregado opcional do Firebase. Começa oculto e só aparece depois de uma leitura válida do documento. |
| 62–67 | Título do checklist, faixa de progresso, marcador de manutenção e rótulo/contêiner do checklist. `script.js` preenche estes elementos. |
| 68–75 | Título e controle para editar a semana, mais a grade `#week-grid`, preenchida dinamicamente. O botão chama `openWeekdaysModal()`. |
| 76 | Fecha `#screen-home`. |

## Tela Treino — linhas 78–92

| Linhas | Explicação |
|---|---|
| 78–79 | Identifica e abre a tela de treino. |
| 80–86 | Linha de título e botão para alternar o modo de gerenciamento. O botão chama `toggleManageMode('workout')`; o SVG representa edição. |
| 87 | `#tabs-row` é o destino das abas criadas a partir dos tipos de treino existentes. |
| 88–90 | Dica inicialmente oculta; `script.js` a revela durante o gerenciamento. |
| 91 | `#exercise-list` recebe os cartões de exercícios do treino ativo. |
| 92 | Fecha a tela. |

## Tela de detalhe do exercício — linhas 93–120

| Linhas | Explicação |
|---|---|
| 93–94 | Comentário e início da tela individual do exercício. |
| 95 | Botão para voltar à lista, chamando `closeExerciseDetail()`. |
| 96 | Abre o cartão de detalhe. |
| 97 | Imagem de fallback enquanto não há mídia; `alt` descreve o conteúdo para acessibilidade. |
| 98 | Elemento de vídeo que o JavaScript revela quando a mídia do exercício é vídeo. `muted`, `loop`, `playsinline` e `preload="none"` evitam som, repetem a execução, favorecem reprodução embutida e adiam carregamento. |
| 99–102 | Área para identificar treino, nome, metadados de séries/repetições e instruções. |
| 103–109 | Seletor entre carga em quilogramas e duração em minutos. `onchange` atualiza rótulos e unidades por `updateExerciseMetric()`. |
| 110–116 | Entrada numérica do valor executado, unidade adjacente e último registro. `min`, `step` e `inputmode` orientam validação e teclado móvel. |
| 117 | Botão que salva a conclusão do exercício por `completeCurrentExercise()`. |
| 118–120 | Fecham cartão e tela. |

## Temporizador — linhas 122–156

| Linhas | Explicação |
|---|---|
| 122–124 | Comentário e abertura da tela do temporizador. |
| 125–131 | Seletor de exercício que será associado ao timer. As opções são preenchidas por JavaScript dentro de grupos por treino. |
| 132–141 | Dois campos numéricos para minutos e segundos; `min`, `max`, `step` e `inputmode` restringem e facilitam a entrada. `oninput` redesenha o mostrador. |
| 142–148 | Mostrador circular com estado acessível `role="timer"`, tempo restante, tempo decorrido e estrutura interna para o CSS. |
| 149–153 | Estado do temporizador e botões para iniciar/pausar/continuar, zerar e pedir permissão de notificação. Cada `onclick` chama a função correspondente. |
| 154–156 | Fecham cartão e tela. |

## Catálogo e rotina pré-treino — linhas 158–186

| Linhas | Explicação |
|---|---|
| 158–159 | Abre a tela do catálogo pré-definido. |
| 160–166 | Título e botão para abrir o modal de novo exercício. O SVG desenha o símbolo de adição. |
| 167 | Instrução sobre cadastro; o catálogo dinâmico aparece no contêiner identificado na própria tela. |
| 171–172 | Identifica e abre a tela de rotina pré-treino. |
| 173–179 | Título e botão que alterna o gerenciamento dos itens da rotina. |
| 180–185 | Barra, rótulo e contêiner da checklist. O botão reinicia as marcações do dia por `resetChecklist()`. |
| 186 | Fecha a tela de rotina. |

## Progresso — linhas 188–214

| Linhas | Explicação |
|---|---|
| 188–189 | Abre a tela de progresso e cria título da evolução. |
| 190–193 | Seletor de exercício e cartão do gráfico. A mudança do seletor executa `renderProgressChart()`. |
| 194–197 | Título e contêineres para o gráfico SVG e histórico tabular. |
| 198–213 | Créditos e links externos de suporte. `target="_blank"` abre outra aba; `rel="noopener"` impede a nova página de controlar a janela de origem. Cada SVG desenha um ícone vetorial inline. |
| 214 | Fecha a tela de progresso. |

## Navegação, toast e modais — linhas 216–322

| Linhas | Explicação |
|---|---|
| 216 | Fecha `<main>`. |
| 218–243 | Barra inferior fixa com seis botões de navegação. Cada botão traz `data-screen`, que é comparado com o nome de tela pelo JavaScript, e chama `switchScreen(...)`. Os SVGs inline desenham ícones; o botão inicial começa ativo. |
| 245 | `#toast` é o destino das mensagens temporárias de feedback. |
| 247–306 | Modal reutilizável para editar tipos de treino, itens pré-treino, exercícios do catálogo e programação semanal. |
| 248–249 | Folha do modal e título que o JavaScript altera segundo o tipo de operação. |
| 251–264 | Campos de horário, nome e detalhe. Alguns começam ocultos porque o mesmo modal serve a vários formulários. |
| 266–276 | Campo de mídia do exercício. O seletor aceita MP4, JPG/JPEG, PNG e GIF; o campo URL permanece disponível. `#field-media-hint` informa o arquivo escolhido; a caixa `#field-clear-media` permite remover a mídia existente. |
| 278–281 | Campo de descrição das instruções, limitado a 240 caracteres. |
| 283–292 | Campos de séries e repetições, usados no cadastro de exercício. |
| 294–298 | Grade interativa dos dias da semana, preenchida pelo JavaScript; cada toque avança entre treinos e descanso. |
| 300–305 | Ações do modal. Cancelar fecha; salvar chama `saveModal()`; excluir chama `deleteModalItem()` e aparece apenas em contextos editáveis apropriados. |
| 308–321 | Segundo modal, específico para adicionar ao treino um exercício já existente no catálogo. O seletor, a dica e os botões são preenchidos/ativados por `script.js`. |
| 322 | Fecha o contêiner geral `#app`. |
| 324 | Carrega o JavaScript depois que o HTML da interface já foi analisado pelo navegador, permitindo que os seletores encontrem os elementos. |
| 325–326 | Fecham o documento. |

---

# 2. `script.js`

O JavaScript é dividido em blocos funcionais. Linhas de comentário identificam esses blocos; funções recebem dados, atualizam o estado e/ou redesenham elementos HTML.

## Firebase e contador de uso — linhas 1–79

| Linhas | Explicação |
|---|---|
| 1–6 | Comentário explica que a configuração Firebase está no cliente e que a segurança real depende das regras do Firestore. |
| 7–14 | `FIREBASE_CONFIG` contém os identificadores públicos do projeto Firebase necessários para inicializar o SDK. Não substitui regras de acesso nem deve conter credenciais privadas. |
| 15–16 | Define a localização do documento agregado `stats/usage` e uma chave local que evita contar mais de uma abertura por navegador. |
| 18–23 | `usageCounterConfigured()` detecta configuração ausente/de exemplo ao testar a chave de API. |
| 25 | `usageDb` guarda a instância Firestore; inicia sem conexão. |
| 26–39 | `initUsageCounter()` encerra se não houver configuração, inicializa Firebase/Firestore dentro de `try`, registra falha no console e, se inicializado, busca o contador e registra a abertura. |
| 41–59 | `loadUsageCount()` lê o documento de contagem, confere se ele existe e se os elementos estão no DOM, formata o número em pt-BR e mostra singular/plural. Erros são avisados sem interromper as demais funções do app. |
| 61–78 | `trackOpenIfNeeded()` consulta a chave local; se ainda não houver registro, incrementa `opens` atomicamente, grava a chave e recarrega a contagem. Falha de rede/regra é registrada no console. |
| 79 | Linha em branco separa Firebase dos dados de aplicação. |

## Dados padrão — linhas 80–317

| Linhas | Explicação |
|---|---|
| 80 | Comentário inicia a seção de dados. |
| 81–83 | `DEFAULT_WORKOUTS` define a estrutura inicial com os treinos A e B vazios. |
| 85–88 | `LEGACY_DEFAULT_WORKOUT_EXERCISE_IDS` lista IDs antigos que a migração remove de treinos para evitar manter entradas predefinidas obsoletas. |
| 90–274 | `DEFAULT_PREDEFINED_EXERCISES` é o catálogo padrão. Cada objeto contém identificador estável, nome, número de séries, faixa de repetições, caminho da mídia (`gifUrl`) e descrição. Cada objeto repetido nesta faixa representa um exercício diferente. |
| 276–313 | `DEFAULT_PRETREINO_ITEMS` declara a checklist inicial. Cada objeto `p1`–`p6` tem hora, rótulo e detalhe; o identificador é usado para persistir a marcação diária. |
| 315 | `WEEKDAYS` dá os rótulos de domingo a sábado na mesma ordem que `Date.getDay()`. |
| 317 | Comentário separador para o armazenamento local. |

## Persistência, migração e inicialização do estado — linhas 318–444

| Linhas | Explicação |
|---|---|
| 318 | Define a chave de `localStorage` para todo o estado versionado do app. |
| 319–357 | `loadState()` tenta ler e analisar JSON salvo. Se leitura/análise falhar, registra aviso; se não houver estado, cria estrutura inicial. Em seguida preenche campos ausentes, define ordem de treinos e migra programações antigas para os dias da semana. O objeto retornado é o estado de trabalho. |
| 320–326 | Lê o valor bruto sob a chave e tenta convertê-lo de JSON; o `catch` evita que dado malformado impeça a abertura. |
| 327–337 | Cria valores básicos para um estado novo e injeta padrões ausentes, copiando estruturas para não compartilhar referências com constantes. |
| 338–356 | Se não houver programação diária, monta os sete dias sem treino e migra os dias antigos (`trainDows`) distribuindo a ordem dos treinos. |
| 358–360 | Fecha a função e define `generateId()`, que combina horário em base 36 com parte aleatória para IDs locais. |
| 362–367 | `saveState()` serializa o estado atual e grava-o em `localStorage`; falhas como quota excedida são registradas no console. |
| 369–381 | Carrega o estado global, garante que `predefinedExercises` seja array e acrescenta exercícios padrão cujos IDs ainda não existem. A `Set` impede duplicação. |
| 382–397 | Garante um objeto `workoutNames`; preenche nomes legíveis para treinos que ainda não têm nome. |
| 398–410 | Executa uma vez a migração dos IDs antigos removendo-os dos treinos e marca a migração como concluída. |
| 411–441 | Percorre cada treino; exercícios antigos ausentes do catálogo são incorporados e campos de mídia/descrição ausentes são normalizados. Os itens dos treinos são sincronizados com seus registros do catálogo. |
| 442–444 | Se alguma migração/padrão alterou dados, persiste o estado atualizado. |

## Data, navegação e gerenciamento — linhas 446–521

| Linhas | Explicação |
|---|---|
| 446–454 | `todayStr()` formata data local como `AAAA-MM-DD`, com mês e dia em dois dígitos; esse formato permite comparar datas. |
| 456–465 | `todayLabel()` gera dia abreviado e data em formato visual `DD/MM`. |
| 467–472 | Se a data da checklist difere de hoje, limpa os itens marcados, grava a nova data e salva. |
| 475–484 | `switchScreen(name)` remove a classe `active` das telas, ativa `screen-${name}`, informa o estado de detalhe ao body, sincroniza botão inferior ativo e rola ao topo. |
| 486–493 | `goToWorkoutFromHome()` navega para Treino e reforça a seleção do botão correspondente. |
| 496–497 | Flags indicam modo de gerenciamento da checklist e da lista de exercícios. |
| 498–519 | `toggleManageMode(scope)` alterna a flag correta e redesenha os controles/dados associados. O ramo da rotina atualiza checklist; o ramo de treino atualiza dica, abas e lista. |
| 521 | Comentário identifica a função de renderização reutilizada pela checklist inicial e pela tela de rotina. |

## Checklist pré-treino — linhas 522–630

| Linhas | Explicação |
|---|---|
| 522–523 | `renderChecklist(containerId, fillId, labelId)` recebe IDs dos três elementos que devem ser atualizados. |
| 524–528 | Encontra o contêiner, determina se é a tela gerenciável, limpa a renderização anterior e zera a contagem. |
| 529–588 | Percorre cada item e cria um cartão. `isDone` consulta o mapa persistido. No modo gerenciamento cria texto e botões de editar/excluir; no modo normal cria caixa de seleção e alterna marcação ao clique. Depois de alternar, salva e redesenha ambas as instâncias da checklist. |
| 589–594 | No modo gerenciamento, cria botão para adicionar novo item pré-treino. |
| 595–597 | Calcula porcentagem concluída, protegendo a divisão por zero com total mínimo igual a 1. |
| 598–612 | Atualiza largura da barra e texto “x de y concluído(s)”. |
| 599–612 | `resetChecklist()` limpa marcações, salva, redesenha as duas listas e mostra confirmação. |
| 614–630 | `confirmDeletePretreino(id)` remove item pelo ID, apaga também sua marcação de conclusão, salva, redesenha e exibe toast. |

## Programação semanal — linhas 632–658

| Linhas | Explicação |
|---|---|
| 632–633 | `renderWeekGrid()` obtém e limpa a grade semanal. |
| 634–641 | Obtém data/dia atuais, calcula a segunda-feira de início (incluindo caso em que hoje é domingo) e cria datas para os sete dias. |
| 642–653 | Para cada data calcula dia da semana, se é hoje e treino programado; cria cartão com classes de cor/estado e insere dia e nome do treino. |
| 654–658 | Encerra iteração/função. |

## Tipos de treino e utilitários de exercício — linhas 659–795

| Linhas | Explicação |
|---|---|
| 659 | Define inicialmente o treino ativo como A. |
| 660–662 | `tagParityClass(tag)` encontra a posição do treino e devolve classe visual alternada `a`/`b`. |
| 664–665 | `getWorkoutName(tag)` busca nome personalizado ou monta um nome padrão. |
| 667–676 | `getNextWorkoutTag()` procura o treino marcado para hoje ou para os dias seguintes, percorrendo no máximo a semana inteira; se nenhum existir, retorna o primeiro da ordem. |
| 678–681 | `isRestDayToday()` identifica descanso quando o dia não tem treino válido associado. |
| 683–732 | `renderTabs()` cria uma aba para cada treino, seleciona a ativa e associa clique para trocar treino. Em modo gerenciamento acrescenta botões editar e excluir (sem permitir excluir o último) e botão para criar tipo de treino. |
| 734–753 | `confirmDeleteWorkoutTag(tag)` evita excluir o último treino; caso contrário limpa treino, ordem, agenda semanal e referências ativas, salva e redesenha as partes dependentes. |
| 755–758 | `setWorkoutTab(tag)` escolhe a aba e redesenha as abas/lista. |
| 760–763 | `getLastLoad(exId)` filtra registros por exercício e devolve o último ou `null`. |
| 765–766 | `getLogValue(log)` suporta tanto o campo atual `value` quanto legado `kg`. |
| 768–769 | `getLogUnit(log)` usa unidade salva ou assume quilogramas em dados antigos. |
| 771–781 | `escapeHtml(value)` substitui `&`, `<`, `>`, aspas e apóstrofo por entidades HTML para inserir texto sem interpretá-lo como marcação. |
| 783–786 | `isTimedExercise(exercise)` reconhece por regex nomes de exercícios tipicamente cronometrados para sugerir minutos em vez de kg. |
| 788–794 | `hasExerciseLogToday(exId, workoutTag)` verifica se existe registro para o exercício, treino e data atual. |

## Lista, detalhe e registro de exercícios — linhas 796–1010

| Linhas | Explicação |
|---|---|
| 796–850 | `renderExerciseList()` limpa a lista e gera estado vazio ou cartões para o treino ativo. Os dados dinâmicos de texto são escapados; em modo normal o cartão abre detalhe por clique/teclado; em gerenciamento, o botão remove o exercício apenas desse treino. Também cria botão para escolher outro item do catálogo e atualiza a lista do timer. |
| 852–870 | `removeExerciseFromWorkout(exId, workoutTag)` verifica exercício e confirmação, remove a cópia do treino, persiste e atualiza listas/cartões relacionados. |
| 872 | `currentExercise` mantém ID do exercício e tag do treino atualmente aberto. |
| 873–949 | `openExerciseDetail()` encontra o exercício, configura fallback de imagem/vídeo e título, descrição, séries, reps e unidade. Após mostrar a tela, chama `resolveExerciseMedia()`; se for vídeo prepara `<video>`, se imagem define o `<img>`. Confere novamente o exercício ativo antes de aplicar resultado assíncrono para não atualizar uma tela já fechada/trocada. |
| 951–962 | `updateExerciseMetric()` muda rótulo e placeholder de acordo com unidade kg/min. |
| 964–966 | `closeExerciseDetail()` limpa exercício selecionado e retorna à tela Treino. |
| 968–1009 | `completeCurrentExercise()` valida seleção e valor positivo finito; cria objeto de registro com exercício, treino, valor, unidade e data. Substitui registro do mesmo exercício/treino/dia ou acrescenta um novo, salva, atualiza e confirma. |
| 1010 | Linha separadora anterior ao temporizador. |

## Temporizador e notificações — linhas 1011–1274

| Linhas | Explicação |
|---|---|
| 1011 | Comentário da seção. |
| 1012–1019 | Objeto `workoutTimer` contém intervalo, duração, tempo decorrido, instante de início e flags rodando/concluído, além do nome do exercício. |
| 1021–1036 | `updateTimerNotificationButton()` esconde notificações em contexto inseguro ou navegador incompatível; caso contrário apresenta estado da permissão e desativa botão quando a decisão já foi tomada. |
| 1038–1055 | `enableWorkoutTimerNotifications()` verifica suporte/contexto seguro, pede permissão e informa resultado; exceções são registradas e mostram feedback. |
| 1057–1078 | `notifyWorkoutTimerCompleted()` mostra toast, tenta vibrar e cria notificação do sistema apenas com permissão concedida. Clique na notificação foca a janela e a fecha. |
| 1080–1114 | `renderTimerExerciseSelect()` refaz opções de exercícios agrupadas por treino, preserva a seleção se possível e bloqueia seletor quando não existem exercícios. |
| 1116–1129 | `formatTimerTime(milliseconds, roundUp)` converte milissegundos em `MM:SS` ou `HH:MM:SS`, podendo arredondar o restante para cima para não exibir zero antes do prazo. |
| 1131–1144 | `getConfiguredWorkoutTimerDuration()` valida minutos/segundos inteiros dentro dos limites e os converte para milissegundos. Valor inválido resulta em zero, que é tratado como não configurado. |
| 1146–1193 | `updateWorkoutTimerDisplay()` atualiza tempo restante/decorrido, progresso circular, rótulo acessível, bloqueio dos campos e texto/estado dos botões. |
| 1195–1208 | `tickWorkoutTimer()` calcula tempo real usando `Date.now()`, marca conclusão, interrompe intervalo, avisa e redesenha. |
| 1210–1255 | `toggleWorkoutTimer()` pausa ou começa/retoma. Antes da primeira execução valida exercício e duração positiva; configura estado, intervalo de atualização e mostrador. |
| 1257–1268 | `resetWorkoutTimer()` interrompe intervalo e recria o timer em estado inicial. |
| 1270–1273 | Ao tornar a aba visível, recalcula o timer se ele estava rodando, compensando suspensão de timers em segundo plano. |

## Seletor de exercício e inclusão no treino — linhas 1275–1342

| Linhas | Explicação |
|---|---|
| 1275–1277 | `openExercisePicker()` atualiza opções e mostra o modal de seleção. |
| 1279–1313 | `renderExercisePicker()` calcula IDs já associados ao treino atual, oferece só itens ainda não adicionados, trata catálogo vazio/todos já adicionados e ajusta dica e botão. |
| 1315–1316 | `closeExercisePicker()` fecha o modal de seleção. |
| 1318–1341 | `addPredefinedExerciseToWorkout()` valida escolha e duplicidade, copia o exercício do catálogo para o treino ativo, salva, redesenha, fecha modal e confirma. |

## URLs e armazenamento local de mídias — linhas 1343–1478

| Linhas | Explicação |
|---|---|
| 1343–1360 | `getSafeGifUrl(value)` transforma URL em endereço absoluto e só aceita HTTP/HTTPS. URLs de `localhost` dentro de `/videos/` são adaptadas para caminhos relativos do app, úteis no teste local. Endereço inválido retorna string vazia. |
| 1362–1365 | Define nome da base IndexedDB, nome do object store, promessa de conexão reutilizada e cache de URLs temporárias `blob:`. |
| 1366–1389 | `openLocalMediaDb()` detecta suporte a IndexedDB; abre/cria a base e object store com `id` como chave. Rejeita erro/bloqueio e limpa a promessa em falha para permitir nova tentativa. |
| 1391–1407 | `saveLocalMedia(file, id)` grava o `Blob` e seus metadados em uma transação de escrita. A promessa só termina após conclusão da transação; falhas de requisição/transação são propagadas. |
| 1409–1418 | `getLocalMedia(id)` recupera o registro em transação de leitura e devolve registro ou `null`. |
| 1420–1431 | `deleteLocalMedia(id)` apaga mídia pela chave e resolve após conclusão; ID vazio não causa trabalho. |
| 1433–1442 | `getMediaType(file)` usa MIME informado pelo navegador ou infere MIME pelas extensões permitidas. |
| 1444–1455 | `getSafeMediaFileType(file)` confere extensão e MIME contra MP4/JPG/JPEG/PNG/GIF; tipo incompatível retorna vazio e impede cadastro. |
| 1457–1474 | `resolveExerciseMedia(exercise)` carrega registro local quando existe `mediaId`, gera/cacheia URL temporária e identifica vídeo MP4. Sem arquivo local, valida e retorna URL externa ou do catálogo. Se um ID local apontar para arquivo ausente, gera erro explícito. |
| 1476–1477 | `isVideoMediaUrl(value)` identifica URLs cujo caminho termina em extensão de vídeo reconhecida. |

## Renderização e exclusão do catálogo — linhas 1479–1631

| Linhas | Explicação |
|---|---|
| 1479–1488 | `renderPredefinedExercises()` localiza/limpa catálogo e cria mensagem para lista vazia. |
| 1489–1522 | Para cada exercício cria cartão, placeholder e área de mídia; resolve a mídia assincronamente e escolhe elemento `<video>` ou `<img>`. |
| 1523–1545 | Configura acessibilidade e propriedades de vídeo/imagem. Oculta prévia até carregar; callbacks de sucesso removem placeholder e erros mostram uma mensagem. |
| 1546–1555 | Define origem da prévia e inicia vídeo; no erro da resolução exibe texto de falha. Placeholder fica oculto se existe URL ou ID de mídia. |
| 1556–1586 | Monta título, séries/repetições, descrição e botões de edição/exclusão; texto é inserido com `textContent` e ações são conectadas às funções de modal/exclusão. |
| 1590–1630 | `deletePredefinedExercise(id)` pede confirmação, remove o exercício do catálogo e de todos os treinos, salva e redesenha. Se tinha arquivo local, remove-o e revoga URL `blob:`; problemas de limpeza são registrados e comunicados. |

## Cartão inicial e evolução — linhas 1632–1779

| Linhas | Explicação |
|---|---|
| 1632 | Comentário identifica a parte da página inicial. |
| 1633–1655 | `updateHeroCard()` escolhe estado de descanso ou treino de hoje e atualiza título, resumo e chamada para ação. `textContent` é usado para dados vindos do usuário. |
| 1657–1665 | `nextScheduledDayLabel()` procura o próximo dia programado após hoje e retorna nome/dia, ou `null`. |
| 1668–1673 | `renderHome()` atualiza o cartão, sincroniza o treino ativo e redesenha abas/lista. |
| 1675 | Comentário de seção de progresso. |
| 1676–1690 | `renderProgressSelect()` recolhe exercícios de todos os treinos, recria opções, tenta manter seleção válida e redesenha gráfico/histórico. |
| 1693–1695 | `formatDate(dstr)` converte data ISO em `DD/MM` para apresentação. |
| 1697–1710 | `renderProgressChart()` obtém registros do exercício selecionado e contêineres; sem dados, mostra estado vazio e limpa histórico. |
| 1711–1736 | Escolhe unidade recente, filtra registros da mesma unidade, define área virtual do SVG e calcula escala/posições para pontos. |
| 1737–1755 | Constrói caminho SVG da linha e área preenchida, círculos dos dados e rótulo do último valor. |
| 1756–1769 | Escreve título e cria SVG do gráfico com gradiente e linhas. |
| 1770–1779 | Ordena histórico do mais recente para o mais antigo e gera tabela com data, treino, valor e unidade. Nomes de treino são escapados. |

## Modal e salvamento — linhas 1780–2072

| Linhas | Explicação |
|---|---|
| 1780–1782 | Comentário e estado temporário do modal: operação atual, ID e agenda em edição. |
| 1783–1863 | `openModal(type, id, workoutTag)` determina se é edição, mostra somente os campos aplicáveis, limpa valores antigos e popula os dados existentes do tipo correspondente. Para exercício, também apresenta estado da mídia atual; para semana, copia agenda e renderiza seletores. |
| 1866–1867 | `openWeekdaysModal()` abre o modal no modo de programação semanal. |
| 1869–1886 | `renderDaySchedulePicker()` recria uma opção visual para cada dia. Ao toque avança para o próximo treino, depois descanso, e redesenha. Nome do treino é escapado antes de inserção em HTML. |
| 1889–1890 | `closeModal()` remove classe de exibição do modal. |
| 1892–1904 | `saveModal()` é assíncrona porque o salvamento de arquivos no IndexedDB pode demorar. A primeira ramificação salva agenda semanal; depois valida o nome comum aos outros tipos. |
| 1905–1948 | Ramo `workoutType`: impede nomes duplicados, renomeia ou cria treino, persiste e redesenha todas as superfícies que dependem da lista de treinos. |
| 1950–1964 | Ramo `pretreino`: recolhe horário/detalhe, altera ou cria item, salva e redesenha checklists. |
| 1965–1985 | Ramo `predefined`: lê formulário, arquivo, URL, opção de remover mídia, série/repetições/descrição; valida série, repetições, tipo/extensão/MIME de arquivo e URL HTTP(S). |
| 1986–2000 | Localiza o item em edição e armazena ID da mídia antiga; se o ID não existe, informa e interrompe. |
| 2001–2012 | Se há arquivo, cria novo ID e salva Blob no IndexedDB. Erro é reportado ao console e à interface, sem salvar metadados inconsistentes. |
| 2013–2020 | Se não há novo arquivo nem URL nem pedido para limpar, conserva mídia local já cadastrada e sua URL anterior. |
| 2021–2039 | Atualiza catálogo e cópias nos treinos em edição ou cria novo objeto; campos `mediaId` e `gifUrl` são mutuamente selecionados pelo fluxo do formulário. |
| 2040–2050 | Salva estado e redesenha catálogo, lista, cartão principal e seletor de progresso. |
| 2051–2060 | Se a mídia anterior foi trocada, tenta removê-la do IndexedDB, revoga seu `blob:` e apaga do cache. Falha é registrada e mostrada. |
| 2061–2062 | Fecha modal e mostra confirmação após salvamento completo. |
| 2063–2071 | `deleteModalItem()` direciona exclusão ao fluxo correto segundo tipo e fecha o modal. |

## Toast, instalação PWA e inicialização — linhas 2073–2144

| Linhas | Explicação |
|---|---|
| 2073 | Comentário da seção de notificações visuais. |
| 2074 | Guarda o ID do temporizador que remove toast antigo. |
| 2075–2081 | `showToast(msg)` insere mensagem com `textContent`, exibe CSS `show` e agenda remoção após 2,2 segundos. O temporizador anterior é cancelado para evitar conflitos. |
| 2083–2084 | Inicia seção PWA e variável para guardar o evento de instalação adiado. |
| 2085–2090 | Listener para `beforeinstallprompt`: impede exibição automática, guarda evento, revela botão e mostra banner se usuário não o dispensou. |
| 2092–2099 | `tryInstall()` abre prompt guardado e limpa estado/banner quando o usuário responde. |
| 2101–2104 | `dismissInstallBanner()` oculta banner, registra decisão no estado e salva. |
| 2106–2110 | `isStandalone()` detecta execução instalada em display standalone, inclusive flag Apple. |
| 2112–2114 | `isiOS()` identifica navegadores iPhone/iPad/iPod pelo user agent. |
| 2115–2123 | Função autoexecutável configura banner: não mostra se já está instalado ou dispensado; em iOS informa procedimento manual de Safari. |
| 2125 | Comentário separa inicialização final. |
| 2126–2131 | Listener do seletor de arquivo atualiza a dica com nome escolhido ou formatos suportados. |
| 2132 | Preenche o selo de data. |
| 2133–2143 | Renderiza checklists, semana, início, catálogo e progresso e por fim inicializa o contador. A ordem garante que elementos de tela existam antes de serem atualizados. |

---

# 3. `style.css`

CSS segue a forma `seletor { propriedade: valor; }`: o seletor encontra elementos/classes/estados HTML; cada declaração muda uma dimensão visual. Regras compactas em uma única linha contêm as mesmas declarações das regras multilinha.

## Variáveis, estilo global e estrutura — linhas 1–75

| Linhas | Seletor/regra | Explicação |
|---|---|---|
| 1–16 | `:root` | Declara variáveis globais de cor, áreas seguras dos dispositivos e `box-sizing`. As demais regras reaproveitam `var(...)` para consistência. |
| 17 | `*` | Aplica `border-box` universalmente, fazendo largura/altura incluírem padding e borda. |
| 18 | `html` | Reserva espaço de rolagem para o topo seguro em dispositivos com recorte. |
| 19–27 | `html, body` | Ocupam altura total, removem margem padrão, aplicam fundo escuro, texto branco e fontes; removem destaque de toque padrão e evitam overscroll vertical. |
| 28–33 | `h1, h2, h3, .display` | Define fonte condensada, peso, espaçamento e remove margens padrão de títulos. |
| 34 | `button` | Faz botões herdarem a fonte da interface. |
| 35–42 | `#app` | Limita conteúdo a 480 px, centraliza e organiza em coluna flexível ocupando ao menos a altura do viewport. |
| 43–53 | `header.topbar` | Cria cabeçalho aderente no topo, com gradiente, padding seguro, borda, camadas e alinhamento horizontal. |
| 54–58 | `.brand` | Alinha símbolo e nome da marca com espaçamento. |
| 59–65 | `.brand-mark` | Define caixa laranja fixa para o ícone, alinhada ao centro. |
| 66 | `.brand-mark svg` | Define tamanho do SVG da marca. |
| 67 | `.brand-title` | Ajusta tamanho, altura de linha e caixa alta do título. |
| 68 | `.brand-title span` | Colore a parte destacada da marca em laranja. |
| 69–72 | `main` | Faz conteúdo expandir e reserva espaço inferior para barra fixa e área segura. |
| 73 | `.screen` | Oculta telas inicialmente e define animação de entrada. |
| 74 | `.screen.active` | Mostra apenas a tela ativa. |
| 75 | `@keyframes fadein` | Move/torna opaco o conteúdo durante entrada em uma tela. |

## Cartão inicial, crédito, checklist e abas — linhas 77–279

| Linhas | Seletor/regra | Explicação |
|---|---|---|
| 77–85 | `.hero-card` | Gradiente, borda, cantos, espaço interno e recorte do cartão principal. |
| 86–94 | `.hero-card::after` | Desenha círculo decorativo translúcido, posicionado relativamente ao cartão. |
| 95 | `.hero-eyebrow` | Estiliza texto auxiliar acima do título. |
| 96 | `.hero-title` | Define tamanho e caixa alta do título principal. |
| 97 | `.hero-title .accent` | Realça trecho do título em laranja. |
| 98 | `.hero-sub` | Define cor, tamanho e distância do resumo. |
| 99–112 | `.hero-cta` | Botão principal do cartão: posição, flex, cores, peso, padding, borda e cursor. |
| 113 | `.hero-cta:active` | Reduz levemente o botão durante pressão. |
| 114–123 | `.usage-count` | Alinha e estiliza o contador agregado do Firebase. |
| 124–132 | `.section-title` | Formata títulos de seção e a disposição do marcador. |
| 133 | `.section-title .bar` | Desenha a pequena barra laranja decorativa. |
| 135–140 | `.dev-credit` | Separa créditos de desenvolvedor do conteúdo anterior. |
| 141–147 | `.made-by` | Formata a instrução de contato em texto discreto. |
| 148–154 | `.dev-name` | Dá destaque tipográfico ao nome de suporte. |
| 155–160 | `.dev-links` | Centraliza links, espaça e permite quebra em telas estreitas. |
| 161–173 | `.dev-link` | Estiliza links de suporte como botões arredondados e sem sublinhado. |
| 174 | `.dev-link svg` | Define tamanho e impede que o ícone encolha. |
| 175–178 | `.wpp`, `.insta` | Colore bordas, texto e traços SVG específicos dos dois links. |
| 180–184 | `.checklist` | Empilha itens de checklist verticalmente com espaçamento. |
| 185–195 | `.check-item` | Alinha caixa e texto, aplica cartão e indica interatividade. |
| 196 | `.check-item.done` | Muda borda/fundo quando item está concluído. |
| 197–203 | `.check-box` | Desenha a caixa de seleção e centraliza o ícone. |
| 204–206 | `.done .check-box` e SVG | Colore caixa concluída e só então exibe o check. |
| 207–210 | `.check-text`, `.check-time`, `.check-label`, `.check-detail` | Distribui texto e hierarquiza hora, rótulo e detalhe por tamanho/cor/peso. |
| 211 | `.check-item.done .check-label` | Risca e atenua rótulo concluído. |
| 213–219 | `.progress-strip` | Desenha trilho fino da porcentagem e recorta seu preenchimento. |
| 220–225 | `.progress-strip-fill` | Gradiente laranja e transição de largura conforme o progresso. |
| 226 | `.progress-label` | Estiliza texto abaixo da barra. |
| 228–232 | `.tabs-row` | Dispõe abas em linha e separa da lista. |
| 233–248 | `.tab-pill` | Define abas flexíveis, texto, borda, fundo e estado normal. |
| 249 | `.tab-pill.active` | Marca a aba ativa com laranja e texto escuro. |
| 250–251 | `.tab-pill-wrap` e `.tab-pill-wrap .tab-pill` | Cria contexto posicionado para botões sobrepostos e faz a aba ocupar toda a largura. |
| 252–261 | `.tab-del` | Posiciona botão redondo de exclusão sobre a aba. |
| 262 | `.tab-del svg` | Dimensiona e colore o ícone do botão excluir. |
| 263–278 | `.workout-type-edit` | Posiciona e estiliza controle circular de edição da categoria. |
| 279 | `.workout-type-edit svg` | Define tamanho/cor do ícone de edição. |

## Cartões de exercício, timer, mídia e formulários — linhas 280–914

As regras seguintes aplicam-se às listas e formulários gerados dinamicamente. Propriedades repetidas têm o significado CSS usual indicado aqui: `display:flex/grid` define o modelo de layout; `gap` cria espaçamento; `padding` é espaço interno; `margin` é espaço externo; `border` contorna; `border-radius` arredonda; `color/background` definem texto/fundo; `font-size/weight` controlam tipografia; `cursor` indica interação; `width/height/min/max` controlam dimensões; `align-items/justify-content` alinham conteúdo.

| Linhas | Seletor/regra | Explicação |
|---|---|---|
| 280–292 | `.workout-manage-hint`, `.tab-add` e ícone | Ajusta dica de gerenciamento e desenha botão tracejado para criar tipo de treino; a última regra define o tamanho do SVG. |
| 294–301 | `.exercise-card` | Cartão para exercício, com fundo, contorno, cantos e padding; cursor sugere abertura. |
| 302–304 | `.exercise-card.manage-mode`, `.exercise-remove-btn`, `.exercise-open-hint` | Remove cursor clicável no gerenciamento, espaça botão de remoção e estiliza dica. |
| 305–312 | Cabeçalho/nome/metadados do exercício | Distribui nome e séries/repetições, dá peso ao nome e mantém metadados em uma linha. |
| 313–318 | `.exercise-row` | Alinha linha de registro e define espaçamento superior. |
| 319–344 | `.load-input-wrap`, `input`, `span` | Agrupa campo e unidade em caixa flexível; estiliza campo numérico e unidade ao lado. |
| 345–359 | `.step-btn`, `.last-load` | Botão quadrado para ajustar valor e texto discreto do último registro. |
| 361–380 | `.finish-bar`, `.btn-primary` | Mantém ação final próxima ao rodapé; desenha botão principal e estado pressionado. |
| 381–393 | `.btn-secondary` | Botão contornado e transparente; declarações posteriores no mesmo bloco ajustam sua cor efetiva. |
| 394–405 | `.exercise-exit`, `.exercise-detail-card` | Ajusta botão de saída e cartão de detalhes do exercício. |
| 406–417 | `.exercise-detail-image`, `.exercise-detail-video` | Compartilha dimensões, fundo, enquadramento e espaçamento da mídia; `[hidden]` remove elementos ocultos do layout. |
| 419–440 | Metadados e descrição do detalhe | Estiliza etiqueta do treino, título, séries/repetições e instruções. |
| 441–463 | Campos e ação de registro | Espaça seletor kg/min, estiliza entrada numérica, reserva área para última carga e separa botão de conclusão. |
| 456 | `body.exercise-detail-open nav.bottom-nav` | Esconde navegação inferior enquanto os detalhes ocupam foco. |
| 458–465 | `.timer-card` e campos internos | Estiliza o cartão de temporizador, separa campos e remove margem do seletor nele. |
| 466–473 | `.timer-duration` e campo | Coloca minutos e segundos em duas colunas e diferencia fundo dos campos. |
| 474–485 | `.timer-clock` | Cria círculo responsivo com gradiente cônico; `--timer-progress` controla o arco do timer. |
| 486–502 | `.timer-clock-inner`, rótulo | Desenha disco interno, centraliza conteúdo e formata rótulo “Restante”. |
| 503–517 | Tempo e rótulo decorrido | Exibe tempo com fonte condensada/tamanho responsivo/algarismos tabulares e separa unidade/rótulo. |
| 518–524 | `.timer-status` | Reserva espaço e centraliza estado do temporizador. |
| 525–532 | `.timer-actions` | Coloca botões do timer em duas colunas e faz o botão secundário ocupar a coluna. |
| 533–537 | `.timer-notification-btn` | Espaça botão de notificação e o remove quando oculto. |
| 539–543 | `.week-grid` | Constrói sete colunas iguais para a agenda. |
| 544–556 | `.week-day` | Desenha cada dia como cartão quadrado com conteúdo central. |
| 557–558 | `.week-day .dow`, `.week-day .tag` | Formata abreviação do dia e nome do treino, permitindo quebrar nomes longos. |
| 559–563 | Classes `.a`, `.b`, `.today` | Distingue treinos alternadamente e destaca o dia atual. |
| 565–571 | `.select-wrap` | Cria moldura visual ao redor de seletores. |
| 572–583 | `select` e `option` | Ajusta largura, fundo, texto, padding e tipografia de opções. |
| 585–591 | `.chart-card` | Cartão do gráfico. |
| 592 | `.chart-title` | Estiliza texto de título do gráfico. |
| 593–598 | `.empty-state` | Centraliza e dá respiro a estados sem conteúdo. |
| 599 | `.history-table` | Faz tabela ocupar largura e colapsa bordas. |
| 600–608 | Cabeçalhos da tabela | Alinha, colore e separa rótulos de coluna. |
| 609–610 | Células/última linha | Define padding e divisórias; remove borda inferior da última linha. |
| 612–623 | `nav.bottom-nav` | Barra de navegação fixa inferior, translúcida, desfocada e dentro da largura máxima do app. |
| 624–643 | `.nav-btn` | Distribui botões igualmente, empilha ícone/texto, reduz tipografia e permite quebra. |
| 644–646 | `.nav-btn svg`, estado `.active` | Define tamanho dos ícones e colore texto/traço selecionado. |
| 648–665 | `.toast` | Posiciona mensagem fixa e anima entrada/saída com opacidade e transformação. |
| 667–695 | `.install-banner` e filhos | Estiliza banner inicialmente oculto, estado visível, texto, botão e controle de fechar. |
| 697–703 | `.section-title-row` | Alinha título e botão de gerenciamento. |
| 704–720 | `.manage-btn` | Botão compacto de gestão com ícone; estado ativo usa laranja. |
| 722–739 | `.item-actions`, `.icon-btn` e ícones | Alinha ações, define botões quadrados e cores distintas para editar/excluir, com estado pressionado. |
| 741 | `.check-item.manage-mode, .exercise-card.manage-mode` | Remove cursor de ação dos cartões durante gerenciamento. |
| 743–758 | `.add-card` | Botão de adição tracejado compartilhado por listas, com estado pressionado e ícone. |
| 760–771 | Lista e cartão pré-definido | Coluna vertical espaçada e cartão recortado com fundo/borda. |
| 772 | `.predefined-media-wrap` | Torna área de mídia contexto para posicionamentos internos. |
| 773–794 | Prévia e placeholder | Dá altura e enquadramento uniforme a imagem, vídeo e placeholder; `[hidden]` oculta elementos inativos. |
| 795–807 | `.predefined-video-badge` | Posiciona selo sobre mídia e estiliza sua leitura; a regra final oculta o selo quando necessário. |
| 808–814 | Conteúdo e heading pré-definidos | Define padding e distribui título/metadados. |
| 815–825 | Descrição e ações do cartão | Formata instrução e alinhamento dos botões. |
| 826–839 | `.catalog-delete-btn` | Marca ação de exclusão em vermelho e ajusta apresentação do botão. |
| 841–855 | `.gif-url-group`, `.media-clear-option` | Destaca formulário de mídia, ajusta label da URL e alinha opção de remover arquivo; `[hidden]` a oculta sem mídia. |
| 856–860 | `.field-textarea` | Define altura mínima, redimensionamento vertical e altura de linha. |
| 862–871 | `.modal-overlay` e `.show` | Camada fixa escura que alinha a folha do modal; começa oculta e é mostrada como flex no estado `.show`. |
| 872–883 | `.modal-sheet`, `@keyframes slideup` | Limita largura/altura, permite rolagem, aplica fundo/cantos/padding seguro e anima a folha de baixo para cima. |
| 884–886 | Título, grupo e label | Define hierarquia do título, espaçamento dos campos e rótulos pequenos em caixa alta. |
| 887–898 | `.field-input` e foco | Define aparência comum das entradas e borda laranja ao receber foco. |
| 899–902 | `.field-row`, `.modal-actions` | Alinha campos e botões em linhas com espaçamento; remove sombra do botão principal dentro do modal. |
| 903–913 | `.btn-delete` | Estiliza ação destrutiva do modal sem preenchimento e em vermelho. |

## Programação de dias e responsividade — linhas 915–991

| Linhas | Seletor/regra | Explicação |
|---|---|---|
| 915–919 | `.day-toggle-grid` | Distribui sete opções de dia em colunas iguais. |
| 920–934 | `.day-toggle` | Cartões interativos quadrados para selecionar treino em cada dia. |
| 935–936 | `.dt-dow`, `.dt-tag` | Hierarquiza abreviação do dia e nome do treino. |
| 937–938 | `.day-toggle.a/.b` | Aplica cores diferentes ao treino alternado. |
| 939 | `.field-hint` | Texto auxiliar discreto com espaçamento e altura de linha. |
| 944–957 | `@media (max-width: 359px)` | Reduz paddings/tamanhos e empilha campos em telas muito estreitas. |
| 962–980 | `@media (min-width: 640px)` | Em telas maiores, coloca fundo ao redor do app, centraliza cartão com sombra e arredonda topo/rodapé. |
| 982–987 | `@media (max-height: 480px) and (orientation: landscape)` | Reduz alturas/paddings de cabeçalho e navegação quando o aparelho está deitado e baixo. |
| 990 | `html, body` | Impede rolagem horizontal acidental. |
| 991 | `img, svg` | Limita imagens e ícones à largura do contêiner. |

## Convenções de valores CSS usados no arquivo

- `var(--...)` lê as variáveis declaradas no início, evitando repetir cores e áreas seguras.
- `px` é medida fixa; `%` é relativo ao contêiner; `vw`/`vh` são relativos à janela; `min()`, `max()` e `clamp()` limitam dimensões responsivas.
- `flex`/`grid` controlam a disposição de filhos; `position: fixed/sticky/absolute/relative` controla posicionamento e contexto.
- `:active`, `:focus`, `.active`, `.done`, `.show` e `[hidden]` selecionam estados de interação ou visibilidade.
- `::after` cria conteúdo decorativo sem adicionar nó no HTML; `@keyframes` descreve animações; `@media` aplica regras somente sob certos tamanhos/orientações.

---

## Fluxo de dados resumido

1. O HTML cria a estrutura estática e os IDs.
2. `script.js` lê `localStorage`, migra formatos antigos e aplica dados padrão.
3. As funções `render...()` criam os elementos repetidos a partir do estado.
4. Eventos de botão/campo mudam o estado; `saveState()` grava alterações.
5. Os arquivos locais passam pelo seletor, validação de extensão/MIME e IndexedDB. O estado guarda apenas o `mediaId`, e a visualização usa uma URL `blob:` temporária.
6. O CSS apresenta cada tela e estado visual e adapta o layout ao tamanho/orientação da tela.
