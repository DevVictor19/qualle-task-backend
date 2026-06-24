import { registerEnumType } from '@nestjs/graphql';
import { TaskStatus } from '@/modules/core/domain/entities/task.entity';

registerEnumType(TaskStatus, { name: 'TaskStatus' });

export { TaskStatus };
