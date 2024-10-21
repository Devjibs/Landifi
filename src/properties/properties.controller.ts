import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { PropertyParamsDto } from './dto/params-property.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthorizationGuard } from 'src/guards/authorization.guards';
import { OwnershipGuard } from 'src/guards/Ownership.guards';
import { CustomRequest } from 'src/common/interfaces/request.interface';
import { QueryPropertyDto } from './dto/query-property.dto';
import { SearchPropertyDto } from './dto/search-property.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Post()
  @Roles(Role.LANDLORD, Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
    @Req() req: CustomRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.propertiesService.create(createPropertyDto, req);
  }

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

  @UseGuards(AuthenticationGuard, AuthorizationGuard, OwnershipGuard)
  @Patch(':id')
  @Roles(Role.LANDLORD, Role.ADMIN)
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

  @UseGuards(AuthenticationGuard, AuthorizationGuard, OwnershipGuard)
  @Delete(':id')
  @Roles(Role.LANDLORD, Role.ADMIN)
  async remove(@Param() propertyParamsDto: PropertyParamsDto, @Req() req) {
    return this.propertiesService.remove(propertyParamsDto.id, req);
  }
}
