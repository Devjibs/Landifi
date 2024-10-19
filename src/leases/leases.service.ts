import { Injectable } from '@nestjs/common';
import { CreateLeaseDto } from './dto/create-lease.dto';
import { UpdateLeaseDto } from './dto/update-lease.dto';

@Injectable()
export class LeasesService {
  create(createLeaseDto: CreateLeaseDto) {
    return 'This action adds a new lease';
  }

  findAll() {
    return `This action returns all leases`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lease`;
  }

  update(id: number, updateLeaseDto: UpdateLeaseDto) {
    return `This action updates a #${id} lease`;
  }

  remove(id: number) {
    return `This action removes a #${id} lease`;
  }
}
