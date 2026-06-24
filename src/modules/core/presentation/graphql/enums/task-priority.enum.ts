import { registerEnumType } from '@nestjs/graphql';
import { TaskPriority } from '@/modules/core/domain/entities/task.entity';

registerEnumType(TaskPriority, { name: 'TaskPriority' });

export { TaskPriority };
