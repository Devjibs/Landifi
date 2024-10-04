import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import { RefreshToken } from './schema/referesh-token.schema';
import { RefreshTokenDto } from './dto/refresh-tokens.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
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

    const tokens = await this.generateUserTokens(user._id);
    return {
      ...tokens,
      userId: user._id,
    };
  }

  async refreshTokens(refreshTokenData: RefreshTokenDto) {
    const token = await this.refreshTokenModel.findOne({
      token: refreshTokenData.refreshToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('Refresh token is invalid!');
    }

    return this.generateUserTokens(token.userId);
  }

  async generateUserTokens(userId) {
    const payload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = uuidv4();

    await this.storeRefreshToken(refreshToken, userId);
    return {
      accessToken,
      refreshToken,
    };
  }

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
}
