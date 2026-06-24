# qualle-task-backend

Backend da aplicação Qualle Task, construído com NestJS e TypeORM (PostgreSQL).

## Arquitetura

O projeto segue os princípios de **Clean Architecture**, organizando o código em camadas com dependências que apontam sempre para dentro (do mais externo ao mais interno: Presentation → Application → Domain).

### Camadas

```
src/
├── shared/               # Kernel compartilhado (bases reutilizáveis entre módulos)
└── modules/
    └── core/             # Bounded context principal
        ├── domain/       # Núcleo — entidades, interfaces de repositório, value objects
        ├── application/  # Casos de uso, DTOs, mappers, interfaces de serviço
        ├── infra/        # Implementações concretas (TypeORM, JWT, bcrypt, PubSub)
        └── presentation/ # Resolvers GraphQL, inputs, outputs, filtros de exceção
```

### Domain

Entidades puras sem dependência de framework: `User`, `Task`, `Comment`, `TaskAssignee`. Os repositórios são definidos aqui como **interfaces** (ports), garantindo que o domínio não conheça o banco de dados. Value objects como `TaskEventVO` encapsulam conceitos do domínio.

### Application

Cada operação é um **use case** isolado (ex: `CreateTaskUseCase`, `AssignTaskUseCase`). Os use cases dependem apenas das interfaces de repositório e de serviço definidas no domínio/application, nunca de TypeORM ou NestJS diretamente. DTOs e mappers fazem a tradução entre camadas.

### Infrastructure

Implementações concretas que satisfazem as interfaces do domínio:
- **Repositórios TypeORM** — `UserTypeormRepository`, `TaskTypeormRepository`, etc., com ORM entities separadas das domain entities.
- **Serviços** — `BcryptHashService`, `JwtService`, `TaskEventBusService` (NestJS EventEmitter), `TaskPubSubService` (graphql-subscriptions).

### Presentation

Resolvers GraphQL code-first. A autenticação JWT é aplicada globalmente via guard, com a anotação `@Public()` marcando as rotas abertas (`register`, `login`). As **subscriptions** usam WebSocket (`graphql-ws`) e publicam eventos via PubSub após o EventBus disparar em resposta às mutations de escrita.

### Fluxo de evento em tempo real

```
Mutation (ex: updateTask)
  → Use Case executa a lógica de negócio
  → Dispara evento no TaskEventBus (EventEmitter)
  → NotifyTaskUpdateUseCase ouve o evento
  → Publica no TaskPubSub (graphql-subscriptions)
  → Subscription filtra por assignee e notifica o cliente via WebSocket
```

## Casos de uso

### Autenticação

| Use Case | Entrada | Saída | Descrição |
|---|---|---|---|
| `UserSignupUseCase` | `name`, `email`, `password` | `void` | Verifica se o e-mail já está em uso (`ConflictError`), faz hash da senha via `HashService` e persiste o novo usuário. |
| `UserLoginUseCase` | `email`, `password` | `accessToken`, `refreshToken` | Busca o usuário pelo e-mail, compara a senha com o hash armazenado (`UnauthorizedError` se inválido) e emite dois JWTs: `accessToken` com validade de 1 hora e `refreshToken` com validade de 7 dias. |

### Usuários

| Use Case | Entrada | Saída | Descrição |
|---|---|---|---|
| `FindUserDetailsUseCase` | `userId` | `UserDto` | Retorna os detalhes de um usuário pelo ID. Lança `ResourceNotFoundError` se não encontrado. |
| `FindUsersPaginatedUseCase` | `page`, `limit`, filtros opcionais | `PaginatedResult<UserDto>` | Listagem paginada de usuários com suporte a filtro por nome (busca parcial). |

### Tarefas

| Use Case | Entrada | Saída | Descrição |
|---|---|---|---|
| `CreateTaskUseCase` | `creatorId`, `title`, `status`, `priority`, opcionais: `description`, `overDueDate` | `TaskDto` | Cria uma nova tarefa associada ao usuário autenticado e a persiste. |
| `UpdateTaskUseCase` | `taskId`, `userId`, campos opcionais | `TaskDto` | Atualiza os campos fornecidos de uma tarefa existente (`ResourceNotFoundError` se não encontrada) e dispara o evento `TASK_UPDATED` no `TaskEventBus` com os IDs dos assignees atuais. |
| `DeleteTaskUseCase` | `taskId` | `void` | Remove uma tarefa pelo ID. |
| `FindTaskDetailsUseCase` | `taskId` | `TaskDto` | Retorna os detalhes completos de uma tarefa, incluindo criador, assignees e comentários. Lança `ResourceNotFoundError` se não encontrada. |
| `FindTasksPaginatedUseCase` | `page`, `limit`, filtros opcionais | `PaginatedResult<TaskDto>` | Listagem paginada de tarefas com suporte a filtros por `status`, `priority` e `overDueDate`. |
| `AssignTaskUseCase` | `taskId`, `loggedUserId`, `assigneeIds[]` | `TaskDto` | Substitui a lista de assignees da tarefa de forma atômica (delete + insert) e dispara o evento `TASK_ASSIGNED`. |
| `AddTaskCommentUseCase` | `taskId`, `userId`, `content` | `TaskDto` | Persiste um novo comentário vinculado à tarefa e dispara o evento `TASK_NEW_COMMENT`. |

### Notificações (event listeners)

Esses use cases não são chamados diretamente por resolvers — eles **escutam eventos** emitidos pelo `TaskEventBus` via `@OnEvent` e os republicam no `TaskPubSubService`, que alimenta as subscriptions WebSocket.

| Use Case | Evento escutado | Ação |
|---|---|---|
| `NotifyTaskUpdateUseCase` | `TASK_UPDATED` | Publica o evento no PubSub para notificar assignees via subscription `taskUpdated`. |
| `NotifyTaskAssignUseCase` | `TASK_ASSIGNED` | Publica o evento no PubSub para notificar assignees via subscription `taskAssigned`. |
| `NotifyTaskCommentUseCase` | `TASK_NEW_COMMENT` | Publica o evento no PubSub para notificar assignees via subscription `taskNewComment`. |

## Pré-requisitos

- Node.js 20+
- pnpm
- PostgreSQL
- make [https://developers.make.com/make-cli/make-cli/install-the-make-cli]

## Configuração

Copie o arquivo de exemplo e preencha as variáveis:

```bash
cp .env.example .env
```

## Migrations

O projeto usa TypeORM com `synchronize: false`, ou seja, todas as mudanças de schema são feitas via migrations.

Os arquivos ficam em `src/database/migrations/` e são gerados em TypeScript.

### Criar migration vazia

Para escrever SQL manualmente:

```bash
make migration-create name=NomeDaMigration
```

### Gerar migration automaticamente

Compara as entities com o estado atual do banco e gera o SQL de diferença:

```bash
make migration-generate name=NomeDaMigration
```

### Rodar migrations pendentes

```bash
make migration-run
```

### Reverter a última migration

```bash
make migration-revert
```

### Ver status das migrations

Mostra quais migrations já foram executadas e quais estão pendentes:

```bash
make migration-show
```

## GraphQL Playground

Com o servidor rodando em modo desenvolvimento (`NODE_ENV=development`), o playground interativo fica disponível em:

```
http://localhost:3000/graphql
```

### Rotas públicas

#### `register` — Cadastro de usuário

```graphql
mutation {
  register(input: {
    name: "Test"
    email: "test@test.com"
    password: "12345678"
  })
}
```

Retorna `true` em caso de sucesso.

#### `login` — Autenticação de usuário

```graphql
mutation {
  login(input: { email: "test@test.com", password: "12345678" }) {
    accessToken
    refreshToken
  }
}
```

Retorna `accessToken` e `refreshToken` em caso de sucesso.

### Rotas protegidas

Todas as rotas abaixo exigem autenticação via JWT. Passe o `accessToken` no header:

```
Authorization: Bearer <accessToken>
```

#### `me` — Perfil do usuário logado

```graphql
query {
  me {
    id
    name
    email
    createdAt
    updatedAt
  }
}
```

#### `users` — Listagem paginada de usuários

Suporta paginação e filtro opcional por `name` (busca parcial).

```graphql
query {
  users(input: { page: 1, limit: 10, name: "João" }) {
    total
    page
    limit
    data {
      id
      name
      email
      createdAt
    }
  }
}
```

#### `tasks` — Listagem paginada de tarefas

Suporta paginação e filtros opcionais por `status`, `priority` e `overDueDate`.

Valores de `status`: `TODO`, `IN_PROGRESS`, `DONE`, `CANCELLED`  
Valores de `priority`: `LOW`, `MEDIUM`, `HIGH`

```graphql
query {
  tasks(input: { page: 1, limit: 10, status: TODO, priority: HIGH }) {
    total
    page
    limit
    data {
      id
      title
      status
      priority
      overDueDate
      creator { id name }
      assignees { id name }
      comments { id content userId }
    }
  }
}
```

#### `task` — Detalhes de uma tarefa

```graphql
query {
  task(taskId: "uuid-da-tarefa") {
    id
    title
    description
    status
    priority
    overDueDate
    creator { id name email }
    assignees { id name email }
    comments { id content userId createdAt }
    createdAt
    updatedAt
  }
}
```

#### `createTask` — Criar tarefa

```graphql
mutation {
  createTask(input: {
    title: "Implementar feature X"
    description: "Descrição opcional"
    status: TODO
    priority: HIGH
    overDueDate: "2026-07-01T00:00:00.000Z"
  }) {
    id
    title
    status
    priority
  }
}
```

#### `updateTask` — Atualizar tarefa

Todos os campos exceto `taskId` são opcionais.

```graphql
mutation {
  updateTask(input: {
    taskId: "uuid-da-tarefa"
    title: "Novo título"
    status: IN_PROGRESS
  }) {
    id
    title
    status
    updatedAt
  }
}
```

#### `deleteTask` — Excluir tarefa

```graphql
mutation {
  deleteTask(input: { taskId: "uuid-da-tarefa" })
}
```

Retorna `true` em caso de sucesso.

#### `assignTask` — Atribuir usuários à tarefa

```graphql
mutation {
  assignTask(input: {
    taskId: "uuid-da-tarefa"
    assigneeIds: ["uuid-do-usuario-1", "uuid-do-usuario-2"]
  }) {
    id
    assignees { id name email }
  }
}
```

#### `addComment` — Adicionar comentário à tarefa

```graphql
mutation {
  addComment(input: {
    taskId: "uuid-da-tarefa"
    content: "Comentário aqui."
  }) {
    id
    comments { id content userId createdAt }
  }
}
```

### Subscriptions

As subscriptions usam WebSocket. A conexão é feita no mesmo endpoint do GraphQL, mas via protocolo `graphql-ws`:

```
ws://localhost:3000/graphql
```

O `accessToken` deve ser enviado nos parâmetros de conexão (`connectionParams`):

```json
{
  "Authorization": "Bearer <accessToken>"
}
```

Os eventos são filtrados automaticamente pelo servidor — o usuário autenticado só recebe notificações de tarefas nas quais ele é assignee.

Todos retornam `TaskNotificationOutput`:

| Campo | Tipo | Descrição |
|---|---|---|
| `taskId` | `String` | ID da tarefa que gerou o evento |
| `eventAuthorId` | `String` | ID do usuário que disparou o evento |
| `eventType` | `String` | Tipo do evento (`TASK_UPDATED`, `TASK_ASSIGNED`, `TASK_NEW_COMMENT`) |

#### `taskUpdated` — Tarefa atualizada

Disparado quando os dados de uma tarefa são modificados.

```graphql
subscription {
  taskUpdated {
    taskId
    eventAuthorId
    eventType
  }
}
```

#### `taskAssigned` — Usuário atribuído a uma tarefa

Disparado quando o usuário é adicionado como assignee de uma tarefa.

```graphql
subscription {
  taskAssigned {
    taskId
    eventAuthorId
    eventType
  }
}
```

#### `taskNewComment` — Novo comentário em tarefa

Disparado quando um comentário é adicionado a uma tarefa da qual o usuário é assignee.

```graphql
subscription {
  taskNewComment {
    taskId
    eventAuthorId
    eventType
  }
}
```
