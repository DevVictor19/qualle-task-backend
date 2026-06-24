import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TaskNotificationOutput {
  @Field()
  taskId: string;

  @Field()
  eventAuthorId: string;

  @Field()
  eventType: string;
}
