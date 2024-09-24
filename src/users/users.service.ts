import {
  ConflictException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
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
      throw new NotImplementedException('Failed to create user!');
    }

    const { password: createdPassword, ...rest } = newUser.toObject();

    return { ...rest };
  }
}
