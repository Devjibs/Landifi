import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
  UploadedFiles,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { RoleBasedGuard } from 'src/guards/role-based.guards';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/common/enums/index.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CustomRequest } from 'src/common/interfaces/request.interface';

@Controller('properties/sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @UseGuards(AuthenticationGuard, RoleBasedGuard)
  @Post()
  @Roles(Role.LANDLORD)
  @UseInterceptors(FilesInterceptor('images', 5))
  async create(
    @Body() createSaleDto: CreateSaleDto,
    @Req() req: CustomRequest,
    @UploadedFiles() // new ParseFilePipe({ validators: [new FileValidationPipe()] }),
    images: Array<Express.Multer.File>,
  ) {
    return this.salesService.create(createSaleDto, images, req);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(+id, updateSaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(+id);
  }
}
