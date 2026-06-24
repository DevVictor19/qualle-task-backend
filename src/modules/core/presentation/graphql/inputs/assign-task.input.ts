import { Field, InputType } from '@nestjs/graphql';
import { ArrayMinSize, IsUUID } from 'class-validator';

@InputType()
export class AssignTaskInput {
  @Field()
  @IsUUID()
  taskId: string;

  @Field(() => [String])
  @IsUUID('all', { each: true })
  @ArrayMinSize(1)
  assigneeIds: string[];
}
