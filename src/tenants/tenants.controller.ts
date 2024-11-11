import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { RoleBasedGuard } from 'src/guards/role-based.guards';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/common/enums/index.enum';
import { PropertyParamsDto } from 'src/properties/dto/params-property.dto';
import { TenantParamsDto } from './dto/params-tenant.dto';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.createTenant(createTenantDto);
  }

  @UseGuards(AuthenticationGuard, RoleBasedGuard)
  @Roles(Role.TENANT)
  @Post('/saveproperty')
  saveProperty(
    @Body() propertyParamsDto: PropertyParamsDto,
    @Req() { userId },
  ) {
    return this.tenantsService.saveProperty(propertyParamsDto, userId);
  }

  @UseGuards(AuthenticationGuard, RoleBasedGuard)
  @Roles(Role.TENANT)
  @Get('/:id')
  findSavedProperties(
    @Param() tenantParamsDto: TenantParamsDto,
    @Req() { userId },
  ) {
    return this.tenantsService.findTenantSaveProperties(
      tenantParamsDto,
      userId,
    );
  }
}
