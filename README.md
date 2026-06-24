# qualle-task-backend

Backend da aplicação Qualle Task, construído com NestJS e TypeORM (PostgreSQL).

## Pré-requisitos

- Node.js 20+
- pnpm
- PostgreSQL

## Configuração

Copie o arquivo de exemplo e preencha as variáveis:

```bash
cp .env.example .env
```

## Migrations

O projeto usa TypeORM com `synchronize: false`, ou seja, todas as mudanças de schema são feitas via migrations.

### Gerar migration

Compara as entities com o estado atual do banco e gera o SQL de diferença automaticamente:

```bash
pnpm run migration:generate -- src/database/migrations/NomeDaMigration
```

### Criar migration vazia

Para escrever SQL manualmente:

```bash
pnpm run migration:create -- src/database/migrations/NomeDaMigration
```

### Rodar migrations pendentes

```bash
pnpm run migration:run
```

### Reverter a última migration

```bash
pnpm run migration:revert
```

### Ver status das migrations

Mostra quais migrations já foram executadas e quais estão pendentes:

```bash
pnpm run migration:show
```

> Os arquivos de migration ficam em `src/database/migrations/` e são gerados em TypeScript.
