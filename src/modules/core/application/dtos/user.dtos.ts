import { TaskDto } from './task.dtos';

export interface UserDto {
  id: string;
  name: string;
  email: string;
  createdTasks?: TaskDto[];
  assignedTasks?: TaskDto[];
  createdAt: Date;
  updatedAt: Date;
}
