import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskAssigneeTable1782299105426 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "task_assignee" (
                "task_id" uuid NOT NULL,
                "user_id" uuid NOT NULL,
                CONSTRAINT "PK_task_assignee" PRIMARY KEY ("task_id", "user_id"),
                CONSTRAINT "FK_task_assignee_task_id" FOREIGN KEY ("task_id")
                    REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_task_assignee_user_id" FOREIGN KEY ("user_id")
                    REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "task_assignee"`);
  }
}
