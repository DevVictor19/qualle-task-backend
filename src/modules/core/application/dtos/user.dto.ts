import { CommentDto } from './comment.dto';
import { TaskDto } from './task.dto';

export interface UserDto {
  id: string;
  name: string;
  email: string;
  createdTasks?: TaskDto[];
  assignedTasks?: TaskDto[];
  comments?: CommentDto[];
  createdAt: Date;
  updatedAt: Date;
}
