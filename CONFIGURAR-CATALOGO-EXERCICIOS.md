# Configurar o catálogo de exercícios

Este guia explica como definir exercícios iniciais no catálogo **Pré-definidos**. Os Treinos 1 e 2 começam vazios; cada pessoa escolhe quais exercícios quer adicionar a cada treino.

## Adicionar exercícios iniciais ao catálogo

1. Abra `script.js` e localize `DEFAULT_PREDEFINED_EXERCISES`, perto do início do arquivo.
2. Dentro da lista, adicione um objeto para cada exercício. Use IDs únicos e permanentes:

```js
{
  id: "catalog-supino-reto",
  name: "Supino reto",
  series: 3,
  reps: "8-10",
  gifUrl: "https://seu-site-publico.com/videos/supino-reto.mp4",
  description: "Desça a barra com controle e empurre até estender os braços.",
},
```

**Prefira vídeo (.mp4) a GIF.** O campo `gifUrl` aceita os dois — o app decide como exibir pela extensão do arquivo (`.mp4`, `.webm`, `.mov`, `.m4v` abrem como vídeo; qualquer outra extensão abre como imagem/GIF). Um vídeo .mp4 com a mesma animação costuma pesar 10-20x menos que o GIF equivalente, carrega mais rápido e usa menos bateria, porque o celular decodifica vídeo em hardware. Para gerar um .mp4 leve a partir de um vídeo ou GIF existente, use o ffmpeg:

```
ffmpeg -i entrada.mp4 -vf "scale=480:-2" -c:v libx264 -crf 28 -preset veryslow -pix_fmt yuv420p -movflags +faststart -an saida.mp4
```

3. Separe os objetos com vírgulas e mantenha-os dentro dos colchetes da lista:

```js
const DEFAULT_PREDEFINED_EXERCISES = [
  {
    id: "catalog-supino-reto",
    name: "Supino reto",
    series: 3,
    reps: "8-10",
    gifUrl: "https://seu-site-publico.com/gifs/supino-reto.gif",
    description: "Desça a barra com controle e empurre até estender os braços.",
  },
  {
    id: "catalog-agachamento",
    name: "Agachamento",
    series: 3,
    reps: "8-10",
    gifUrl: "https://seu-site-publico.com/gifs/agachamento.gif",
    description: "",
  },
];
```

Cada exercício precisa de um `id` diferente. Não altere nem reutilize IDs que já foram publicados: eles identificam o exercício no catálogo e nos treinos. Informe um número inteiro de séries, repetições como texto e uma URL pública `http://` ou `https://`. Use um endereço direto para o arquivo (vídeo ou GIF), acessível sem login e que permita incorporação em outros sites.

Não altere `DEFAULT_WORKOUTS` para cadastrar exercícios: essa constante define os treinos iniciais vazios. Os exercícios iniciais são acrescentados a `state.predefinedExercises` durante a inicialização do app.

## Como uma pessoa adiciona um exercício ao treino

1. Abra a tela **Treino**.
2. Toque em **Tipos de treino** para entrar no modo de gerenciamento.
3. No treino desejado, escolha **Escolher exercício pré-definido**.
4. Selecione um exercício do catálogo e toque em **Adicionar**.
5. Repita no outro treino, se desejar.

Também é possível cadastrar exercícios individuais na tela **Pré-definidos**, pelo botão **Novo exercício**. Esses cadastros locais ficam salvos apenas naquele navegador/dispositivo.

## Testar e publicar

1. Salve `script.js`.
2. Teste localmente ou abra o app em uma aba anônima e confirme que os exercícios aparecem em **Pré-definidos**.
3. Abra cada GIF para verificar se carrega; se não aparecer, confira se a URL aponta diretamente para uma imagem pública.
4. Para que outras pessoas recebam o catálogo inicial atualizado, publique a versão atualizada da aplicação no serviço de hospedagem.
5. Abra a versão publicada e confira o catálogo. Se estiver vendo uma versão antiga, confirme que a publicação terminou e faça uma recarga forçada da página.

Salvar o arquivo no editor não publica o site. A aba anônima ajuda a testar sem os dados pessoais do navegador normal, mas ainda carrega os arquivos que estão publicados no endereço que você abriu.

## O que é local e o que é inicial

- Os itens de `DEFAULT_PREDEFINED_EXERCISES` são incorporados ao catálogo local de quem abrir a aplicação. Adicionar itens nessa lista e publicar a alteração disponibiliza os novos itens para todos.
- Cada pessoa pode adicionar, editar ou excluir exercícios pela interface. Essas mudanças são guardadas no navegador/dispositivo dela; não são sincronizadas com as demais pessoas.
- Excluir um exercício em **Pré-definidos** também o remove dos treinos locais onde estava. Os exercícios definidos no código podem voltar a ser acrescentados ao catálogo na próxima abertura.
- **Remover deste treino** apenas tira o exercício do treino selecionado; ele permanece no catálogo e pode ser adicionado a outro treino.
- Ao abrir a versão que introduziu os treinos vazios, uma migração executada uma única vez remove dos Treinos 1 e 2 os IDs dos exercícios padrão antigos (`a1`–`a6` e `b1`–`b7`). Ela mantém os exercícios com outros IDs e preserva o catálogo, inclusive a Prancha (`a6`); assim, os treinos ficam vazios sem apagar os exercícios disponíveis. Depois da migração, a pessoa pode escolher novamente qualquer exercício do catálogo para cada treino.

Este catálogo inicial não é um banco de dados compartilhado com sincronização contínua. Para distribuir alterações futuras, atualize `DEFAULT_PREDEFINED_EXERCISES` e publique a aplicação; para sincronizar cadastros e alterações feitos por usuários, seria necessário implementar armazenamento central.
