import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CommentOrmEntity,
  CommentTypeOrmRepository,
  HashServiceImpl,
  JwtServiceImpl,
  TaskAssigneeOrmEntity,
  TaskAssigneeTypeOrmRepository,
  TaskEventBusServiceImpl,
  TaskOrmEntity,
  TaskTypeOrmRepository,
  UserOrmEntity,
  UserTypeOrmRepository,
} from './infra';
import {
  CommentRepository,
  TaskAssigneeRepository,
  TaskRepository,
  UserRepository,
} from './domain';
import {
  AddTaskCommentUseCase,
  AssignTaskUseCase,
  CreateTaskUseCase,
  DeleteTaskUseCase,
  FindTaskDetailsUseCase,
  FindTasksPaginatedUseCase,
  FindUserDetailsUseCase,
  HashService,
  JwtService,
  TaskEventBusService,
  UpdateTaskUseCase,
  UserLoginUseCase,
  UserSignupUseCase,
} from './application';
import { SignupResolver } from './presentation';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentOrmEntity,
      TaskAssigneeOrmEntity,
      TaskOrmEntity,
      UserOrmEntity,
    ]),
  ],
  providers: [
    { provide: CommentRepository, useClass: CommentTypeOrmRepository },
    {
      provide: TaskAssigneeRepository,
      useClass: TaskAssigneeTypeOrmRepository,
    },
    {
      provide: TaskRepository,
      useClass: TaskTypeOrmRepository,
    },
    {
      provide: UserRepository,
      useClass: UserTypeOrmRepository,
    },
    {
      provide: HashService,
      useClass: HashServiceImpl,
    },
    {
      provide: JwtService,
      useClass: JwtServiceImpl,
    },
    {
      provide: TaskEventBusService,
      useClass: TaskEventBusServiceImpl,
    },
    AddTaskCommentUseCase,
    AssignTaskUseCase,
    CreateTaskUseCase,
    DeleteTaskUseCase,
    FindTaskDetailsUseCase,
    FindTasksPaginatedUseCase,
    FindUserDetailsUseCase,
    UpdateTaskUseCase,
    UserLoginUseCase,
    UserSignupUseCase,
    SignupResolver,
  ],
})
export class CoreModule {}
