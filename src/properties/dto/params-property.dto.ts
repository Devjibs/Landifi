import { IsDefined, IsMongoId } from 'class-validator';

export class PropertyParamsDto {
  @IsMongoId()
  @IsDefined()
  id: string;
}
