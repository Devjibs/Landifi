import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, USER_MODEL } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryUserDto } from './dto/query-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  RefreshToken,
  REFRESHTOKENMODEL,
} from 'src/auth/schema/referesh-token.schema';
import { UserParamsDto } from './dto/params-user.dto';
import { MailService } from 'src/common/mail/mail.service';
import {
  EmailVerificationToken,
  EMAILVERIFICATIONTOKENMODEL,
} from 'src/auth/schema/verification-token.schema';
import { PropertiesService } from 'src/properties/properties.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(USER_MODEL) private userModel: Model<User>,
    @InjectModel(REFRESHTOKENMODEL)
    private refreshTokenModel: Model<RefreshToken>,
    @InjectModel(EMAILVERIFICATIONTOKENMODEL)
    @Inject(forwardRef(() => PropertiesService))
    private propertiesService: PropertiesService,
  ) {}

  // async createUser(createUserDto: CreateUserDto): Promise<string | User> {
  //   const { email, firstName, lastName, password, userType } = createUserDto;
  //   const existingUser = await this.userModel.findOne({ email: email });
  //   if (existingUser) {
  //     throw new ConflictException('User already exists!');
  //   }
  //   const saltOrRounds = 15;
  //   const hashedPassword = bcryptjs.hashSync(password, saltOrRounds);
  //   const newUser = await this.userModel.create({
  //     email,
  //     password: hashedPassword,
  //     firstName,
  //     lastName,
  //     userType,
  //   });

  //   if (!newUser) {
  //     throw new InternalServerErrorException('Failed to create user!');
  //   }

  //   const newUserObject = newUser.toObject();

  //   // Generate email verification link
  //   const expiryDate = new Date();
  //   expiryDate.setHours(expiryDate.getHours() + 1);
  //   const verificationToken = nanoid(64);
  //   const verificationOTP = crypto.randomInt(100000, 1000000).toString();
  //   await this.emailVerificationModel.create({
  //     OTP: verificationOTP,
  //     token: verificationToken,
  //     userId: newUserObject._id,
  //     expiryDate,
  //   });

  //   // Send link to user by email
  //   this.mailService.sendVerificationEmail(
  //     email,
  //     verificationOTP,
  //     newUserObject.firstName,
  //   );

  //   return `Account created successfully. A token has been sent to ${email} and will expire in 1 hour time.`;
  // }

  async findAllUsers(queryUserDto: QueryUserDto): Promise<string | User[]> {
    const { page = 1, limit = 10 } = queryUserDto;
    const allUsers = await this.userModel
      .find()
      .select('-leases -purchases')
      .populate('properties')
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

  async findUserById(
    userParamsDto: UserParamsDto,
    userId: string,
  ): Promise<User> {
    if (userParamsDto.id !== userId) {
      throw new ForbiddenException('You are not authorized');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with the specified ID not found!`);
    }
    return user;
  }

  async updateUser(
    userParamsId: string,
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    if (userParamsId !== userId) {
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

    return `User with the email: ${deletedUser.email} deleted successfully!`;
  }

  async getUserPermission(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User not found!`);
    }
    return user.userType;
  }

  // Delete later if not useful
  // async updateLandlordProperty(landlordId: string, propertyId) {
  //   const landlord = await this.userModel.findOne({
  //     _id: landlordId,
  //     userType: 'landlord',
  //   });
  //   const {} = landlord
  //   landlord.properties = propertyId;
  //   landlord.save();

  // await this.userModel.findOneAndUpdate(
  //   { _id: landlordId },
  //   {
  //     $addToSet: { properties: propertyId },
  //   },
  //   { new: true },
  // );
  // }
}
