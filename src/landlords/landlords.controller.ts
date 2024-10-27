import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LandlordsService } from './landlords.service';
import { CreateLandlordDto } from './dto/create-landlord.dto';
import { LandlordParamsDto } from './dto/params-landlord.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { RoleBasedGuard } from 'src/guards/role-based.guards';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/common/enums/index.enum';
import { UpdateLandlordDto } from './dto/update-landlord.dto';

@Controller('landlords')
export class LandlordsController {
  constructor(private readonly landlordsService: LandlordsService) {}

  @Post()
  create(@Body() createLandlordDto: CreateLandlordDto) {
    return this.landlordsService.createLandlord(createLandlordDto);
  }

  @UseGuards(AuthenticationGuard, RoleBasedGuard)
  @Roles(Role.LANDLORD)
  @Get(':id')
  findOne(@Param() landlordParamsDto: LandlordParamsDto, @Req() { userId }) {
    return this.landlordsService.findLandlordById(landlordParamsDto, userId);
  }

  @UseGuards(AuthenticationGuard, RoleBasedGuard)
  @Roles(Role.LANDLORD)
  @Patch(':id')
  async updateUserById(
    @Param() landlordParamsDto: LandlordParamsDto,
    @Body() updateLandlordDto: UpdateLandlordDto,
    @Req() { userId },
  ) {
    return this.landlordsService.updateLandlord(
      landlordParamsDto.id,
      userId,
      updateLandlordDto,
    );
  }

  @UseGuards(AuthenticationGuard, RoleBasedGuard)
  @Roles(Role.LANDLORD)
  @Delete(':id')
  async removeUser(
    @Param() landlordParamsDto: LandlordParamsDto,
    @Req() { userId },
  ) {
    return this.landlordsService.removeLandlordById(landlordParamsDto, userId);
  }
}
