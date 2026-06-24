import { Field, ObjectType } from '@nestjs/graphql';
import { TaskPriority, TaskStatus } from '../enums';
import { CommentType } from './comment.type';
import { UserType } from './user.type';

@ObjectType()
export class TaskType {
  @Field()
  id: string;

  @Field()
  creatorId: string;

  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => TaskStatus)
  status: TaskStatus;

  @Field(() => TaskPriority)
  priority: TaskPriority;

  @Field(() => Date, { nullable: true })
  overDueDate?: Date | null;

  @Field(() => UserType, { nullable: true })
  creator?: UserType;

  @Field(() => [UserType], { nullable: true })
  assignees?: UserType[];

  @Field(() => [CommentType], { nullable: true })
  comments?: CommentType[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
