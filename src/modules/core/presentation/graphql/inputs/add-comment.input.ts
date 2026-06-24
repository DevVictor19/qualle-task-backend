import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

@InputType()
export class AddCommentInput {
  @Field()
  @IsUUID()
  taskId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  content: string;
}
