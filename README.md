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
