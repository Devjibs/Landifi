import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';
import * as crypto from 'crypto';
import * as bcryptjs from 'bcryptjs';
import { SALTORROUND } from 'src/constants/index.contant';
import { Tenant, TENANT_MODEL, TenantDocument } from './schemas/tenant.schema';
import { USER_MODEL, UserDocument } from 'src/users/schemas/user.schema';
import {
  EmailVerificationToken,
  EMAILVERIFICATIONTOKENMODEL,
} from 'src/auth/schema/verification-token.schema';
import {
  RefreshToken,
  REFRESHTOKENMODEL,
} from 'src/auth/schema/referesh-token.schema';
import { MailService } from 'src/common/mail/mail.service';
import { LeasesService } from 'src/leases/leases.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Role } from 'src/common/enums/index.enum';
import { PropertyParamsDto } from 'src/properties/dto/params-property.dto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(TENANT_MODEL)
    private readonly tenantModel: Model<TenantDocument>,
    @InjectModel(USER_MODEL)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(EMAILVERIFICATIONTOKENMODEL)
    private emailVerificationModel: Model<EmailVerificationToken>,
    @InjectModel(REFRESHTOKENMODEL)
    private refreshTokenModel: Model<RefreshToken>,
    private mailService: MailService,
    private leaseService: LeasesService,
  ) {}

  async createTenant(
    createTenantDto: CreateTenantDto,
  ): Promise<string | Tenant> {
    const { email, firstName, lastName, password, userType } = createTenantDto;
    // Check if email exists in the base User model
    const existingUser = await this.userModel.findOne({ email: email });
    if (existingUser) {
      throw new ConflictException('User already exists!');
    }

    const hashedPassword = bcryptjs.hashSync(password, SALTORROUND);
    const newUser = await this.tenantModel.create({
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

  async saveProperty(propertyId: string, userId: string) {
    const alreadySavedProperty = await this.tenantModel.findOne({
      _id: userId,
      savedProperties: { $in: [propertyId] },
    });

    console.log(alreadySavedProperty);

    // const updateTenantSavedProperty = await this.tenantModel.findOneAndUpdate(
    //   { _id: userId, userType: Role.TENANT },
    //   { $push: { savedProperties: propertyId } },
    //   { new: true },
    // );

    // if (!updateTenantSavedProperty) {
    //   throw new InternalServerErrorException(
    //     'Failed to save property for user.',
    //   );
    // }

    // return updateTenantSavedProperty;
  }
}
