import { IsDefined, IsMongoId } from 'class-validator';

export class UserParamsDto {
  @IsMongoId()
  @IsDefined()
  userId: string;
}
