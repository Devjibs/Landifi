import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { PropertyParamsDto } from './dto/params-property.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/common/enums/index.enum';
import { RoleBasedGuard } from 'src/guards/role-based.guards';
import { OwnershipGuard } from 'src/guards/Ownership.guards';
import { QueryPropertyDto } from './dto/query-property.dto';
import { SearchPropertyDto } from './dto/search-property.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  async findAll(@Query() queryPropertyDto: QueryPropertyDto) {
    return this.propertiesService.findAll(queryPropertyDto);
  }

  @Get('search')
  async searchProperty(@Query() searchPropertyDto: SearchPropertyDto) {
    return this.propertiesService.searchProperty(searchPropertyDto);
  }

  @Get(':id')
  async findOne(@Param() propertyParamsDto: PropertyParamsDto) {
    return this.propertiesService.findOne(propertyParamsDto.id);
  }

  @UseGuards(AuthenticationGuard, RoleBasedGuard, OwnershipGuard)
  @Patch(':id')
  @Roles(Role.LANDLORD)
  async update(
    @Param() propertyParamsDto: PropertyParamsDto,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @Req() req,
  ) {
    return this.propertiesService.update(
      propertyParamsDto.id,
      updatePropertyDto,
      req,
    );
  }

  @UseGuards(AuthenticationGuard, RoleBasedGuard, OwnershipGuard)
  @Delete(':id')
  @Roles(Role.LANDLORD)
  async remove(@Param() propertyParamsDto: PropertyParamsDto, @Req() req) {
    return this.propertiesService.remove(propertyParamsDto.id, req);
  }
}
