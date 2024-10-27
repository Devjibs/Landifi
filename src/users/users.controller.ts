import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Req,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { QueryUserDto } from './dto/query-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UserParamsDto } from './dto/params-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAllUsers(@Query() queryUserDto: QueryUserDto) {
    return this.usersService.findAllUsers(queryUserDto);
  }

  @Get('search')
  async searchUser(@Query() searchUserDto: SearchUserDto) {
    return this.usersService.searchUser(searchUserDto);
  }

  @UseGuards(AuthenticationGuard)
  @Get(':id')
  async findUserById(@Param() userParamsDto: UserParamsDto, @Req() { userId }) {
    return this.usersService.findUserById(userParamsDto, userId);
  }

  @UseGuards(AuthenticationGuard)
  @Patch(':id')
  async updateUserById(
    @Param() userParamsDto: UserParamsDto,
    @Body() updateUserDto: UpdateUserDto,
    @Req() { userId },
  ) {
    return this.usersService.updateUser(
      userParamsDto.id,
      userId,
      updateUserDto,
    );
  }

  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  async removeUser(@Param() userParamsDto: UserParamsDto, @Req() { userId }) {
    return this.usersService.removeUserById(userParamsDto, userId);
  }
}
