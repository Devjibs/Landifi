import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LeasesService } from './leases.service';
import { CreateLeaseDto } from './dto/create-lease.dto';
import { UpdateLeaseDto } from './dto/update-lease.dto';

@Controller('leases')
export class LeasesController {
  constructor(private readonly leasesService: LeasesService) {}

  @Post()
  create(@Body() createLeaseDto: CreateLeaseDto) {
    return this.leasesService.create(createLeaseDto);
  }

  @Get()
  findAll() {
    return this.leasesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leasesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeaseDto: UpdateLeaseDto) {
    return this.leasesService.update(+id, updateLeaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leasesService.remove(+id);
  }
}
