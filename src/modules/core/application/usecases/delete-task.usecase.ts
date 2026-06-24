import { UseCase } from '@/shared/application';
import { Injectable } from '@nestjs/common';
import { TaskRepository } from '../../domain';

export interface DeleteTaskInputDto {
  taskId: string;
}

@Injectable()
export class DeleteTaskUseCase implements UseCase<DeleteTaskInputDto, void> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: DeleteTaskInputDto): Promise<void> {
    await this.taskRepository.delete(input.taskId);
  }
}
