import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import {
  RefreshToken,
  RefreshTokenSchema,
} from 'src/auth/schema/referesh-token.schema';
import {
  EmailVerificationToken,
  EmailVerificationTokenSchema,
} from 'src/auth/schema/verification-token.schema';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      {
        name: EmailVerificationToken.name,
        schema: EmailVerificationTokenSchema,
      },
    ]),
    MailModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
