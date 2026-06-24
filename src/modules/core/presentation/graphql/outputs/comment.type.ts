import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommentType {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  taskId: string;

  @Field()
  content: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
