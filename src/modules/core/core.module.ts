import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@/shared/infra';
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
  TaskPubSubServiceImpl,
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
  FindUsersPaginatedUseCase,
  HashService,
  JwtService,
  NotifyTaskAssignUseCase,
  NotifyTaskCommentUseCase,
  NotifyTaskUpdateUseCase,
  TaskEventBusService,
  TaskPubSubService,
  UpdateTaskUseCase,
  UserLoginUseCase,
  UserSignupUseCase,
} from './application';
import {
  LoginResolver,
  SignupResolver,
  TaskResolver,
  TaskSubscriptionResolver,
  UserResolver,
} from './presentation';

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
    { provide: APP_GUARD, useClass: JwtAuthGuard },
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
    {
      provide: TaskPubSubService,
      useClass: TaskPubSubServiceImpl,
    },
    AddTaskCommentUseCase,
    AssignTaskUseCase,
    CreateTaskUseCase,
    DeleteTaskUseCase,
    FindTaskDetailsUseCase,
    FindTasksPaginatedUseCase,
    FindUserDetailsUseCase,
    FindUsersPaginatedUseCase,
    UpdateTaskUseCase,
    UserLoginUseCase,
    UserSignupUseCase,
    NotifyTaskAssignUseCase,
    NotifyTaskCommentUseCase,
    NotifyTaskUpdateUseCase,
    SignupResolver,
    LoginResolver,
    UserResolver,
    TaskResolver,
    TaskSubscriptionResolver,
  ],
})
export class CoreModule {}
