import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  RefreshToken,
  RefreshTokenSchema,
} from './schema/referesh-token.schema';
import { ResetToken, ResetTokenSchema } from './schema/reset-token.schema';
import { MailModule } from 'src/mail/mail.module';
import {
  EmailVerificationToken,
  EmailVerificationTokenSchema,
} from './schema/verification-token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: ResetToken.name, schema: ResetTokenSchema },
      {
        name: EmailVerificationToken.name,
        schema: EmailVerificationTokenSchema,
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('secrets.jwtSecret'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
      global: true,
    }),
    MailModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
