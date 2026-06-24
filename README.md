# qualle-task-backend

Backend da aplicação Qualle Task, construído com NestJS e TypeORM (PostgreSQL).

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

### Mutations disponíveis

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

Retorna `true` em caso de sucesso. Em caso de erro de validação, a resposta inclui os detalhes no campo `errors`.

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
