import { IsDefined, IsMongoId } from 'class-validator';

export class LandlordParamsDto {
  @IsMongoId()
  @IsDefined()
  id: string;
}
