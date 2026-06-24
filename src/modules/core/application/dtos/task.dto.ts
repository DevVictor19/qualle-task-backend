import { Maybe } from '@/shared/domain';
import { UserDto } from './user.dto';
import { CommentDto } from './comment.dto';

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
  comments?: CommentDto[];
  createdAt: Date;
  updatedAt: Date;
}
