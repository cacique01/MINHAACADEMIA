# Registro individual de exercícios

Este documento explica a implementação da tela individual de exercício no app KinoraFit. Cada exercício pode ser aberto, registrado e concluído separadamente, sem concluir os outros exercícios do treino.

## Fluxo para quem usa o app

1. Na tela **Treino**, selecione a aba do treino desejado.
2. Toque em um exercício. O cartão também informa se ele já foi concluído hoje e mostra o registro mais recente.
3. Na tela do exercício, confira o treino, o nome, as séries e as repetições.
4. Escolha o que deseja registrar: **carga (kg)** ou **tempo (minutos)**.
5. Informe um valor maior que zero e toque em **Concluir exercício**.
6. O app salva apenas aquele exercício e retorna à lista. O cartão passa a indicar **Concluído hoje**.

O botão **Sair do exercício** retorna à lista sem salvar. A tela individual esconde a navegação inferior para manter o foco no exercício aberto.

## Elementos da interface

Em `index.html`, a tela `#screen-exercise` contém:

- O botão para sair sem concluir.
- A imagem ilustrativa do exercício, carregada do arquivo local `4929985-training-icon-on-white-linear-style-vetor.jpg`.
- Os campos para identificar o treino e mostrar o nome, as séries e as repetições.
- O seletor de unidade (`#exercise-metric`), com as opções kg e minutos.
- O campo numérico (`#exercise-value`) e a unidade exibida ao lado.
- O botão **Concluir exercício**.

Os estilos em `style.css` apresentam essa área como uma tela focada no exercício, adaptada ao layout do app e aos controles de toque. A imagem usa `object-fit: contain` para manter sua proporção.

## Comportamento no JavaScript

As funções relacionadas ficam em `script.js`:

- `openExerciseDetail(exId, workoutTag)` localiza o exercício dentro do treino selecionado, preenche a tela e abre o registro. Se o exercício não existir mais, mostra uma mensagem em vez de abrir dados inválidos.
- `updateExerciseMetric()` atualiza o rótulo e a unidade do campo conforme a pessoa escolhe kg ou minutos.
- `closeExerciseDetail()` fecha a tela individual e retorna à lista sem gravar.
- `completeCurrentExercise()` verifica se existe um exercício aberto, valida que o valor informado é numérico e positivo e salva somente aquele registro.
- `hasExerciseLogToday(exId, workoutTag)` verifica se aquele exercício, naquele treino, já tem um registro na data atual; essa informação é apresentada no cartão.
- `getLogValue(log)` e `getLogUnit(log)` leem registros novos e antigos. Registros antigos que possuem `kg`, mas não têm `value` ou `unit`, continuam sendo interpretados como carga em kg.

Ao concluir, se já existir um registro para o mesmo exercício, treino e data, ele é atualizado em vez de criar uma duplicata. Os outros exercícios e os registros de outros treinos permanecem inalterados. A lista, a persistência local e a tela de progresso são atualizadas.

## Formato do registro

Os registros são armazenados em `state.logs`, que é persistido pelo mecanismo local já usado pelo app. Um registro novo tem este formato:

```js
{
  exId: "a1",
  exName: "Agachamento (livre ou leg press)",
  workout: "A",
  value: 20,
  unit: "kg",
  date: "2026-10-12"
}
```

Para tempo, `value` contém os minutos e `unit` é `"min"`. A identificação pelo ID do exercício, treino e data mantém a conclusão individual. Registros históricos no formato anterior, que armazenavam o valor no campo `kg`, permanecem legíveis.

## Cartões e progresso

Na lista, cada cartão normal abre seu exercício e pode ser acionado por clique, Enter ou Espaço. O modo de gerenciamento continua dedicado a editar e remover exercícios; os controles de gerenciamento não abrem a tela individual.

O gráfico e o histórico de progresso continuam filtrados pelo exercício selecionado. Para evitar misturar medidas incompatíveis, a visualização usa a unidade do registro mais recente daquele exercício e mostra os registros dessa unidade. Assim, uma atividade registrada em kg e em minutos não soma valores de tipos diferentes no mesmo gráfico.

## Validações e comportamento esperado

- Valor vazio, inválido, igual a zero ou negativo não conclui o exercício; o app solicita um valor válido.
- Sair da tela não altera os registros.
- Concluir um exercício não marca todo o treino como concluído nem altera os outros exercícios.
- Reabrir o exercício depois de salvá-lo mostra o último registro e sua unidade.
- O registro salvo fica disponível após atualizar ou reabrir o app, pois usa o armazenamento local já existente.

## Temporizador por exercício

A tela **Temporizador** permite selecionar qualquer exercício cadastrado nos treinos, definir uma duração em minutos e segundos e iniciar o relógio. Durante a execução, o círculo exibe o tempo restante em contagem regressiva e, dentro dele, o tempo decorrido em contagem crescente.

Os controles permitem pausar, continuar e zerar. Enquanto a contagem está em andamento ou pausada, o exercício e a duração ficam bloqueados para evitar alterar uma sessão em curso; ao zerar, é possível escolher outro exercício e configurar outro tempo. A duração aceita valores de 1 segundo até 23h59m59s.

O temporizador usa o instante atual para calcular o tempo transcorrido, em vez de somar os intervalos do navegador. Isso mantém a contagem correta mesmo quando o navegador atrasa a atualização visual. O timer continua contando ao navegar para outra tela e atualiza a contagem ao retornar à aba. Ao chegar a zero, mostra um aviso no app, vibra quando o dispositivo oferece suporte e envia uma notificação do navegador se a pessoa ativar a permissão pelo botão **Ativar notificações ao terminar**. A notificação do navegador depende de um contexto seguro (HTTPS ou localhost) e pode ser bloqueada nas configurações do navegador. O timer não grava um registro de carga ou duração do exercício; serve como relógio de execução.

## Catálogo Pré-definidos

A tela **Pré-definidos** funciona como o catálogo central de exercícios. Nela é possível cadastrar e editar nome, séries, repetições, uma instrução curta e a URL do GIF de execução. O campo da URL fica destacado e pode permanecer vazio durante o cadastro, para ser preenchido depois. Quando ainda não há GIF, o catálogo mostra um aviso; na tela individual, o app usa a ilustração local como alternativa.

Para adicionar uma atividade a um treino, entre no modo **Tipos de treino** e escolha **Escolher exercício pré-definido**. A seleção copia para aquele treino os dados do catálogo; o mesmo exercício não pode ser adicionado duas vezes ao mesmo treino. A tela Treino permite gerenciar apenas os tipos de treino e escolher atividades já cadastradas: para criar ou editar um exercício, use a tela Pré-definidos. Excluir do catálogo remove o exercício do catálogo e de todos os treinos, após confirmação.

Na primeira abertura após essa atualização, exercícios personalizados que já existiam nos treinos são incorporados a `state.predefinedExercises`, preservando IDs, nomes, séries e repetições. Os IDs dos exercícios padrão antigos (`a1`–`a6` e `b1`–`b7`) são tratados separadamente: são removidos uma vez dos Treinos 1 e 2 para que eles comecem vazios, mas permanecem no catálogo. A pessoa pode adicioná-los novamente a qualquer treino pela seleção no catálogo.

## Tipos de treino com nome livre

Na tela **Treino**, o modo **Tipos de treino** permite criar um tipo com nome livre — por exemplo, “Treino superior” — e renomear ou excluir tipos existentes. Os exercícios são adicionados a cada tipo pela seleção no catálogo Pré-definidos; os cartões dos exercícios não mostram controles para criar ou editar atividades.

O estado mantém um ID interno estável para cada tipo e guarda o rótulo apresentado em `state.workoutNames`. Assim, renomear um tipo não quebra os dias já programados nem os registros associados. Os IDs antigos A/B são mantidos internamente; na migração inicial, seus rótulos são convertidos para “Treino 1”, “Treino 2” e assim por diante, prontos para serem renomeados. As telas Início, semana, timer, exercício e histórico apresentam os nomes personalizados.
