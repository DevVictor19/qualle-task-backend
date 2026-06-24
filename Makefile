DS=src/database/data-source.ts
MIGRATIONS_DIR=src/database/migrations
TS_NODE_PROJECT=tsconfig.migrations.json

migration-create:
	pnpx typeorm migration:create $(MIGRATIONS_DIR)/$(name)

migration-generate:
	TS_NODE_PROJECT=$(TS_NODE_PROJECT) pnpx typeorm-ts-node-commonjs migration:generate $(MIGRATIONS_DIR)/$(name) -d $(DS)

migration-run:
	TS_NODE_PROJECT=$(TS_NODE_PROJECT) pnpx typeorm-ts-node-commonjs migration:run -d $(DS)

migration-revert:
	TS_NODE_PROJECT=$(TS_NODE_PROJECT) pnpx typeorm-ts-node-commonjs migration:revert -d $(DS)

migration-show:
	TS_NODE_PROJECT=$(TS_NODE_PROJECT) pnpx typeorm-ts-node-commonjs migration:show -d $(DS)

.PHONY: migration-create migration-generate migration-run migration-revert migration-show
