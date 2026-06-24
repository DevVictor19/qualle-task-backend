import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
