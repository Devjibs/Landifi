import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import { QueryUserDto } from './dto/query-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RefreshToken } from 'src/auth/schema/referesh-token.schema';
import { UserParamsDto } from './dto/params-user.dto';
import { MailService } from 'src/mail/mail.service';
import { EmailVerificationToken } from 'src/auth/schema/verification-token.schema';
import { nanoid } from 'nanoid';
import { PropertiesService } from 'src/properties/properties.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
    @InjectModel(EmailVerificationToken.name)
    private emailVerificationModel: Model<EmailVerificationToken>,
    private mailService: MailService,
    private propertiesService: PropertiesService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<string | User> {
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

    const newUserObject = newUser.toObject();

    // Generate email verification link
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);
    const verificationToken = nanoid(64);
    await this.emailVerificationModel.create({
      token: verificationToken,
      userId: newUserObject._id,
      expiryDate,
    });

    // Send link to user by email
    this.mailService.sendVerificationEmail(
      email,
      verificationToken,
      newUserObject.firstName,
    );

    return 'Account created successfully. Please check your email to proceed.';
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
    userParamsDto: UserParamsDto,
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    if (userParamsDto.id !== userId) {
      throw new ForbiddenException('You are not authorized');
    }

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

  async removeUserById(
    userParamsDto: UserParamsDto,
    userId: string,
  ): Promise<string> {
    if (userParamsDto.id !== userId) {
      throw new ForbiddenException('You are not authorized');
    }

    const deletedUser = await this.userModel.findByIdAndDelete(
      userParamsDto.id,
    );
    if (!deletedUser) {
      throw new NotFoundException(`User with the specified ID not found!`);
    }

    // Delete refresh token from database if user is deleted
    await this.refreshTokenModel.findOneAndDelete({ userId: deletedUser._id });
    // Delete all property by the user
    await this.propertiesService.removeAll(deletedUser._id.toString());

    return `User deleted successfully!`;
  }

  async getUserPermission(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User not found!`);
    }
    return user.userType;
  }
}
