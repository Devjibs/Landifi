import { IsDefined, IsMongoId } from 'class-validator';

export class TenantParamsDto {
  @IsMongoId()
  @IsDefined()
  id: string;
}
