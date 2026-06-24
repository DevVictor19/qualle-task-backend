import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskTable1782299068836 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."task_status_enum" AS ENUM('TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."task_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH')`,
    );
    await queryRunner.query(`
            CREATE TABLE "task" (
                "id" uuid NOT NULL,
                "creator_id" uuid NOT NULL,
                "title" character varying NOT NULL,
                "description" text,
                "status" "public"."task_status_enum" NOT NULL,
                "priority" "public"."task_priority_enum" NOT NULL,
                "overdue_date" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_task_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_task_creator_id" FOREIGN KEY ("creator_id")
                    REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`DROP TYPE "public"."task_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."task_priority_enum"`);
  }
}
