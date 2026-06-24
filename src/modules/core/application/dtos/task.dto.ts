import { Maybe } from '@/shared/domain';
import { UserDto } from './user.dto';

export interface TaskDto {
  id: string;
  creatorId: string;
  title: string;
  description?: Maybe<string>;
  status: string;
  priority: string;
  overDueDate?: Maybe<Date>;
  creator?: UserDto;
  assignees?: UserDto[];
  createdAt: Date;
  updatedAt: Date;
}
