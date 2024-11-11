import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';
import * as bcryptjs from 'bcryptjs';
import * as crypto from 'crypto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { USER_MODEL, UserDocument } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import {
  RefreshToken,
  REFRESHTOKENMODEL,
} from './schema/referesh-token.schema';
import { RefreshTokenDto } from './dto/refresh-tokens.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetToken, RESETTOKENMODEL } from './schema/reset-token.schema';
import { MailService } from 'src/common/mail/mail.service';
import {
  EmailVerificationToken,
  EMAILVERIFICATIONTOKENMODEL,
} from './schema/verification-token.schema';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { RequestionNewVerificationDto } from './dto/request-new-verification.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(USER_MODEL) private userModel: Model<UserDocument>,
    @InjectModel(REFRESHTOKENMODEL)
    private refreshTokenModel: Model<RefreshToken>,
    @InjectModel(RESETTOKENMODEL)
    private resetTokenModel: Model<ResetToken>,
    @InjectModel(EMAILVERIFICATIONTOKENMODEL)
    private emailVerificationModel: Model<EmailVerificationToken>,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Wrong credentials!');
    }

    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials!');
    }

    if (user.isVerified) {
      // Generate JWT tokens
      const tokens = await this.generateUserTokens(user._id.toString());
      return {
        ...tokens,
        userId: user._id,
      };
    } else {
      // Generate and send new email verification link
      await this.emailVerificationModel.findOneAndDelete({
        userId: user._id,
        expiryDate: { $gte: new Date() },
      });

      // Create verification
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const verificationToken = nanoid(64);
      const verificationOTP = crypto.randomInt(100000, 1000000).toString();
      await this.emailVerificationModel.create({
        OTP: verificationOTP,
        token: verificationToken,
        userId: user._id,
        expiryDate,
      });

      // Send link to user by email
      this.mailService.sendVerificationEmail(
        email,
        verificationOTP,
        user.firstName,
      );

      throw new UnauthorizedException(
        `User with email: ${user.email} not verified! Please verify your email to continue.`,
      );
    }
  }

  // Handles regenration of new refresh token attending to request from frontend
  // async refreshTokens(refreshTokenData: RefreshTokenDto) {
  //   const token = await this.refreshTokenModel.findOne({
  //     token: refreshTokenData.refreshToken,
  //   });

  //   if (!token) {
  //     throw new UnauthorizedException('Refresh token is invalid!');
  //   }

  //   const validToken = token.expiryDate > new Date();

  //   if (!validToken) {
  //     await this.resetTokenModel.findByIdAndDelete(token._id);
  //     throw new UnauthorizedException('Refresh token expired!');
  //   }

  //   return this.generateUserTokens(token.userId);
  // }
  async refreshTokens(refreshTokenData: RefreshTokenDto) {
    // Find the refresh token in the database
    const token = await this.refreshTokenModel.findOne({
      token: refreshTokenData.refreshToken,
    });

    // If token is not found, return unauthorized
    if (!token) {
      throw new UnauthorizedException('Refresh token is invalid!');
    }

    // Check if token is expired
    const isTokenExpired = token.expiryDate <= new Date();
    
    if (isTokenExpired) {
      // Delete expired refresh token from the database
      await this.refreshTokenModel.findByIdAndDelete(token._id);
      throw new UnauthorizedException('Refresh token expired!');
    }

    // Generate and return new access token
    return this.generateUserTokens(token.userId.toString());
  }

  async generateUserTokens(userId: string) {
    const payload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = uuidv4();

    // Call the store refresh token function
    await this.storeRefreshToken(refreshToken, userId);
    return {
      accessToken,
      refreshToken,
    };
  }

  // Creates and update refresh token in the database
  async storeRefreshToken(token: string, userId: string) {
    // Calculate expiry date 3 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);
    await this.refreshTokenModel.updateOne(
      { userId },
      { $set: { expiryDate, token } },
      { upsert: true },
    );
  }

  // Change password
  async changePassword(changePasswordData: ChangePasswordDto, userId: string) {
    const { oldPassword, newPassword } = changePasswordData;
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const passwordMatch = await bcryptjs.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new NotFoundException('Wrong credentials!');
    }
    const newHashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = newHashedPassword;
    await user.save();
    return `Password for ${user.email} changed successfully.`;
  }

  async forgotPassword(forgotPasswordData: ForgotPasswordDto) {
    const { email } = forgotPasswordData;
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      return { message: 'If this user exists, they will receive an email.' };
    }

    // Generate password reset link
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);
    const resetToken = nanoid(64);
    const resetOTP = crypto.randomInt(100000, 1000000).toString();
    await this.resetTokenModel.create({
      OTP: resetOTP,
      token: resetToken,
      userId: user._id,
      expiryDate,
    });

    // Send link to user by email
    this.mailService.sendPasswordResetEmail(email, resetOTP, user.firstName);

    return { message: 'If this user exists, they will receive an email.' };
  }

  async resetPassword(resetPasswordData: ResetPasswordDto) {
    const { resetOTP, newPassword } = resetPasswordData;
    const validOTP = await this.resetTokenModel.findOne({
      OTP: resetOTP,
    });

    if (!validOTP) {
      throw new NotFoundException('Invalid OTP');
    }

    const validToken = await this.resetTokenModel.findOneAndDelete({
      token: validOTP.token,
      expiryDate: { $gte: new Date() },
    });
    if (!validToken) {
      throw new NotFoundException('Expired OTP');
    }
    const user = await this.userModel.findById(validToken.userId);
    if (!user) {
      throw new InternalServerErrorException();
    }
    const newHashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = newHashedPassword;
    await user.save();
    return `Password for ${user.email} changed successfully.`;
  }

  // Handles email verificaiton
  async emailVerification(verifyEmailData: VerifyEmailDto) {
    const { verificationOTP } = verifyEmailData;
    const validOTP = await this.emailVerificationModel.findOne({
      OTP: verificationOTP,
    });
    
    if (!validOTP) {
      throw new NotFoundException('Invalid OTP');
    }

    const validToken = await this.emailVerificationModel.findOneAndDelete({
      token: validOTP.token,
      expiryDate: { $gte: new Date() },
    });

    if (!validToken) {
      throw new NotFoundException('Expired OTP. Get new OTP.');
    }

    const user = await this.userModel.findById(validToken.userId);
    if (!user) {
      throw new InternalServerErrorException();
    }
    user.isVerified = true;
    await user.save();
    return `User with email: ${user.email} verified successfully! Proceed to login.`;
  }

  // Handle new verification requestion
  async requestNewVerification(
    requestionNewVerificationDto: RequestionNewVerificationDto,
  ) {
    const { email } = requestionNewVerificationDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    if (user.isVerified === true) {
      return `User with email: ${user.email} already verified. Please login.`;
    } else {
      // Delete any existing verification OTP for user
      await this.emailVerificationModel.findOneAndDelete({
        userId: user._id,
      });

      // Create new verification
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const verificationToken = nanoid(64);
      const verificationOTP = crypto.randomInt(100000, 1000000).toString();
      await this.emailVerificationModel.create({
        OTP: verificationOTP,
        token: verificationToken,
        userId: user._id,
        expiryDate,
      });

      // Send link to user by email
      this.mailService.sendVerificationEmail(
        email,
        verificationOTP,
        user.firstName,
      );
      return 'If this user exists, they will receive a new OTP via email.';
    }
  }
}
