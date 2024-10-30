import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  UseInterceptors,
  Req,
  UploadedFiles,
} from '@nestjs/common';
import { LeasesService } from './leases.service';
import { CreateLeaseDto } from './dto/create-lease.dto';
import { UpdateLeaseDto } from './dto/update-lease.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { RoleBasedGuard } from 'src/guards/role-based.guards';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/common/enums/index.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CustomRequest } from 'src/common/interfaces/request.interface';
import { PropertyParamsDto } from 'src/properties/dto/params-property.dto';
import { OwnershipGuard } from 'src/guards/Ownership.guards';

@Controller('properties/leases')
export class LeasesController {
  constructor(private readonly leasesService: LeasesService) {}

  @UseGuards(AuthenticationGuard, RoleBasedGuard)
  @Post()
  @Roles(Role.LANDLORD)
  @UseInterceptors(FilesInterceptor('images', 5))
  async create(
    @Body() createLeaseDto: CreateLeaseDto,
    @Req() req: CustomRequest,
    @UploadedFiles() // new ParseFilePipe({ validators: [new FileValidationPipe()] }),
    images: Array<Express.Multer.File>,
  ) {
    return this.leasesService.create(createLeaseDto, images, req);
  }

  @UseGuards(AuthenticationGuard, RoleBasedGuard, OwnershipGuard)
  @Patch(':id')
  @Roles(Role.LANDLORD)
  @UseInterceptors(FilesInterceptor('images', 5))
  async update(
    @Param() leasePropertyParamsDto: PropertyParamsDto,
    @Body() updateLeaseDto: UpdateLeaseDto,
    @Req() req: CustomRequest,
    @UploadedFiles() // new ParseFilePipe({ validators: [new FileValidationPipe()] }),
    images: Array<Express.Multer.File>,
  ) {
    return this.leasesService.update(
      leasePropertyParamsDto.id,
      updateLeaseDto,
      req,
      images,
    );
  }

  // @Get()
  // findAll() {
  //   return this.leasesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.leasesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLeaseDto: UpdateLeaseDto) {
  //   return this.leasesService.update(+id, updateLeaseDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.leasesService.remove(+id);
  // }
}
