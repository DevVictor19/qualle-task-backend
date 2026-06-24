import { MigrationInterface, QueryRunner } from 'typeorm';

export class CommentTable1782299123940 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "comment" (
                "id" uuid NOT NULL,
                "task_id" uuid NOT NULL,
                "user_id" uuid NOT NULL,
                "content" text NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_comment_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_comment_task_id" FOREIGN KEY ("task_id")
                    REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "FK_comment_user_id" FOREIGN KEY ("user_id")
                    REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "comment"`);
  }
}
