import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import * as crypto from 'crypto';
import { SALTORROUND } from 'src/constants/index.contant';
import { CreateLandlordDto } from './dto/create-landlord.dto';
import {
  Landlord,
  LANDLORD_MODEL,
  LandlordDocument,
} from './schemas/landlord.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import {
  RefreshToken,
  REFRESHTOKENMODEL,
} from 'src/auth/schema/referesh-token.schema';
import { MailService } from 'src/common/mail/mail.service';
import {
  EmailVerificationToken,
  EMAILVERIFICATIONTOKENMODEL,
} from 'src/auth/schema/verification-token.schema';
import { USER_MODEL, UserDocument } from 'src/users/schemas/user.schema';
import { LandlordParamsDto } from './dto/params-landlord.dto';
import { UpdateLandlordDto } from './dto/update-landlord.dto';
import { PropertiesService } from 'src/properties/properties.service';
import { QueryPropertyDto } from 'src/properties/dto/query-property.dto';
import { Role } from 'src/common/enums/index.enum';

@Injectable()
export class LandlordsService {
  constructor(
    @InjectModel(LANDLORD_MODEL)
    private readonly landlordModel: Model<LandlordDocument>,
    @InjectModel(USER_MODEL)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(EMAILVERIFICATIONTOKENMODEL)
    private emailVerificationModel: Model<EmailVerificationToken>,
    @InjectModel(REFRESHTOKENMODEL)
    private refreshTokenModel: Model<RefreshToken>,
    private mailService: MailService,
    private propertiesService: PropertiesService,
  ) {}

  async createLandlord(
    createLandordDto: CreateLandlordDto,
  ): Promise<string | Landlord> {
    const { email, firstName, lastName, password, userType } = createLandordDto;
    const existingUser = await this.userModel.findOne({ email: email });
    if (existingUser) {
      throw new ConflictException('User already exists!');
    }

    const hashedPassword = bcryptjs.hashSync(password, SALTORROUND);
    const newUser = await this.landlordModel.create({
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
    const verificationOTP = crypto.randomInt(100000, 1000000).toString();
    await this.emailVerificationModel.create({
      OTP: verificationOTP,
      token: verificationToken,
      userId: newUserObject._id,
      expiryDate,
    });

    // Send link to user by email
    this.mailService.sendVerificationEmail(
      email,
      verificationOTP,
      newUserObject.firstName,
    );

    return `Account created successfully. A token has been sent to ${email} and will expire in 1 hour time.`;
  }

  async findLandlordById(
    landlordParamsDto: LandlordParamsDto,
    userId: string,
  ): Promise<Landlord> {
    if (landlordParamsDto.id !== userId) {
      throw new ForbiddenException('You are not authorized');
    }

    const landlord = await this.landlordModel
      .findOne({
        id: userId,
        userType: Role.LANDLORD,
      })
      .populate('properties');
    if (!landlord) {
      throw new NotFoundException(`User with the specified ID not found!`);
    }
    return landlord;
  }

  async updateLandlord(
    landlordParamsId: string,
    userId: string,
    updateLandlordDto: UpdateLandlordDto,
  ): Promise<Landlord> {
    if (landlordParamsId !== userId) {
      throw new ForbiddenException('You are not authorized');
    }

    const updateLandlord = await this.landlordModel.findOneAndUpdate(
      {
        id: userId,
        userType: Role.LANDLORD,
      },
      updateLandlordDto,
      {
        new: true,
      },
    );

    if (!updateLandlord) {
      throw new NotFoundException(`User with the specified ID not found!`);
    }
    return updateLandlord;
  }

  async removeLandlordById(
    landlordParamsDto: LandlordParamsDto,
    userId: string,
  ): Promise<string> {
    if (landlordParamsDto.id !== userId) {
      throw new ForbiddenException('You are not authorized');
    }

    const deletedLandlord = await this.userModel.findByIdAndDelete(
      landlordParamsDto.id,
    );
    if (!deletedLandlord) {
      throw new NotFoundException(`User with the specified ID not found!`);
    }

    // Delete refresh token from database if user is deleted
    await this.refreshTokenModel.findOneAndDelete({
      userId: deletedLandlord._id,
    });
    // Delete all property by the user
    await this.propertiesService.removeAll(deletedLandlord._id.toString());

    return `User with the email: ${deletedLandlord.email} deleted successfully!`;
  }

  // Properties
  async findAllPropertiesForLandlord(
    queryPropertyDto: QueryPropertyDto,
    userId,
  ) {
    const landloardProperties =
      await this.propertiesService.findAllPropertiesForLandlord(
        queryPropertyDto,
        userId,
      );
    return landloardProperties;
  }
}
