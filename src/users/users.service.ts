import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  NotImplementedException,
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
import { EMAILVERIFICATIONTOKENMODEL } from 'src/auth/schema/verification-token.schema';
import { PropertiesService } from 'src/properties/properties.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(USER_MODEL) private userModel: Model<User>,
    @InjectModel(REFRESHTOKENMODEL)
    private refreshTokenModel: Model<RefreshToken>,
    @InjectModel(EMAILVERIFICATIONTOKENMODEL)
    @Inject(forwardRef(() => PropertiesService))
    private propertiesService: PropertiesService,
    private cloudinaryService: CloudinaryService,
  ) {}

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

  async findUserById(userParamsDto: UserParamsDto, userId: string) {
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
    image?: Express.Multer.File,
  ): Promise<User> {
    if (userParamsId !== userId) {
      throw new ForbiddenException('You are not authorized');
    }

    const userToBeUpdated = await this.userModel.findOne({
      _id: userId,
    });

    if (image) {
      // Get existing images
      const { image: existingImage } = userToBeUpdated;
      if (existingImage) {
        await this.cloudinaryService.deleteImage(existingImage.public_id);
      }

      // Upload new images
      const userImageObject = await this.cloudinaryService.uploadImage(
        image,
        'users',
      );

      if (!userImageObject) {
        throw new ConflictException('Failed to upload user image!');
      }

      // Attach the new image data to the updated property
      const updateUserWithImage = await this.userModel.findByIdAndUpdate(
        userId,
        { ...updateUserDto, image: userImageObject },
        { new: true },
      );

      if (!updateUserWithImage) {
        throw new NotImplementedException(`User profile update failed!`);
      }

      return updateUserWithImage;
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
    console.log('Updated without image', updatedUser);

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
}
