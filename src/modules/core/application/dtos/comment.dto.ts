import { TaskDto } from './task.dto';
import { UserDto } from './user.dto';

export interface CommentDto {
  id: string;
  userId: string;
  taskId: string;
  content: string;
  task?: TaskDto;
  user?: UserDto;
  createdAt: Date;
  updatedAt: Date;
}
