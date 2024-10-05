import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import { QueryUserDto } from './dto/query-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, firstName, lastName, password, userType } = createUserDto;
    const existingUser = await this.userModel.findOne({ email: email });
    if (existingUser) {
      throw new ConflictException('User already exists!');
    }
    const saltOrRounds = 15;
    const hashedPassword = bcryptjs.hashSync(password, saltOrRounds);
    const newUser = await this.userModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      userType,
    });

    if (!newUser) {
      throw new InternalServerErrorException('Failed to create user!');
    }

    // TODO Send email verification mail to users
    return newUser;
  }

  async findAllUsers(queryUserDto: QueryUserDto): Promise<string | User[]> {
    const { page = 1, limit = 10 } = queryUserDto;
    const allUsers = await this.userModel
      .find()

      .skip((+page - 1) * +limit)
      .limit(+limit);

    if (!allUsers) {
      throw new NotFoundException('Failed to fetch users!');
    }
    if (allUsers.length === 0) {
      return 'User resource array is empty!';
    }
    return allUsers;
  }

  async searchUser(searchUserDto: SearchUserDto): Promise<User[]> {
    if (
      !searchUserDto.firstName &&
      !searchUserDto.email &&
      !searchUserDto.usertype
    ) {
      throw new NotFoundException(
        'No search criteria provided. Please provide a search criteria such as firstName, email or usertype.',
      );
    }
    const users = await this.userModel.find({ ...searchUserDto });
    if (users.length === 0) {
      throw new NotFoundException(
        'No user found with provided search criteria!',
      );
    }
    return users;
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with the specified ID not found!`);
    }
    return user;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      updateUserDto,
      {
        new: true,
      },
    );

    if (!updatedUser) {
      throw new NotFoundException(`User with the specified ID not found!`);
    }
    return updatedUser;
  }

  async removeUserById(userId: string): Promise<string> {
    const deletedUser = await this.userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new NotFoundException(`User with the specified ID not found!`);
    }
    return `User deleted successfully!`;
  }
}
