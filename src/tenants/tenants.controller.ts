import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { RoleBasedGuard } from 'src/guards/role-based.guards';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/common/enums/index.enum';
import { PropertyParamsDto } from 'src/properties/dto/params-property.dto';

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
  saveProperty(@Body() propertyId: string, @Req() { userId }) {
    return this.tenantsService.saveProperty(propertyId, userId);
  }
}
