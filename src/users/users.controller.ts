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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UserParamsDto } from './dto/params-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async findAllUsers(@Query() queryUserDto: QueryUserDto) {
    return this.usersService.findAllUsers(queryUserDto);
  }

  @Get('search')
  async searchUser(@Query() searchUserDto: SearchUserDto) {
    return this.usersService.searchUser(searchUserDto);
  }

  @Get(':id')
  async findUserById(@Param() userParamsDto: UserParamsDto) {
    return this.usersService.findUserById(userParamsDto.id);
  }

  // TODO Add authenticaiton and authorization guards
  @Patch(':id')
  async updateUserById(
    @Param() userParamsDto: UserParamsDto,
    @Body() updateUserDto: UpdateUserDto,
    @Req() { userId },
  ) {
    return this.usersService.updateUser(userParamsDto.id, updateUserDto);
  }

  // TODO Add authenticaiton and authorization guards
  @Delete(':id')
  async removeUser(@Param() userParamsDto: UserParamsDto, @Req() { userId }) {
    return this.usersService.removeUserById(userParamsDto.id);
  }
}
