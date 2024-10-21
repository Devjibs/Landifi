import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Property } from './schema/property.schema';
import { Model } from 'mongoose';
import { CustomRequest } from 'src/common/interfaces/request.interface';
import { QueryPropertyDto } from './dto/query-property.dto';
import { SearchPropertyDto } from './dto/search-property.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<Property>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto, req: CustomRequest) {
    const { userId } = req;
    const newProperty = new this.propertyModel({
      ...createPropertyDto,
      owner: userId,
    });
    const savedProperty = await newProperty.save();
    if (!savedProperty) {
      throw new InternalServerErrorException('Failed to create new property!');
    }
    await this.userModel.findByIdAndUpdate(
      userId,
      { $push: { properties: savedProperty._id } },
      { new: true },
    );
    return savedProperty;
  }

  async findAll(queryPropertyDto: QueryPropertyDto) {
    const { page = 1, limit = 20 } = queryPropertyDto;

    const allProperties = await this.propertyModel
      .find()
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .populate(
        'owner',
        '-updatedAt -isVerified -createdAt -leases -purchases -properties',
      );

    if (!allProperties) {
      throw new NotFoundException('Failed to fetch properties!');
    }
    if (allProperties.length === 0) {
      return 'Property resource is empty.';
    }
    return allProperties;
  }

  async findOne(propertyId: string) {
    const property = await this.propertyModel
      .findById(propertyId)
      .populate(
        'owner',
        '-updatedAt -isVerified -createdAt -leases -purchases -properties',
      );
    if (!property) {
      throw new NotFoundException('Property not found!');
    }
    return property;
  }

  async searchProperty(
    searchPropertyDto: SearchPropertyDto,
  ): Promise<Property[]> {
    if (
      !searchPropertyDto.landloard &&
      !searchPropertyDto.status &&
      !searchPropertyDto.type
    ) {
      throw new NotFoundException('No search criteria provided.');
    }
    const properties = await this.propertyModel.find({ ...searchPropertyDto });
    if (properties.length === 0) {
      throw new NotFoundException(
        'No property found with provided search criteria!',
      );
    }
    return properties;
  }

  async update(
    propertyParam: string,
    updatePropertyDto: UpdatePropertyDto,
    req,
  ) {
    const updatedProperty = await this.propertyModel.findByIdAndUpdate(
      propertyParam,
      updatePropertyDto,
      { new: true },
    );

    if (!updatePropertyDto) {
      throw new NotFoundException(`Property not found!`);
    }
    return updatedProperty;
  }

  async remove(propertyId: string, req: CustomRequest) {
    const { userId } = req;

    const deletedProperty =
      await this.propertyModel.findByIdAndDelete(propertyId);
    if (!deletedProperty) {
      throw new NotFoundException('Property not found!');
    }

    await this.userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { properties: deletedProperty._id.toString() } },
        { new: true },
      )
      .exec();

    return 'Property deleted successfully';
  }

  async removeAll(userId: string) {
    const deletedProperties = await this.propertyModel.deleteMany({
      owner: userId,
    });
    if (!deletedProperties) {
      throw new NotFoundException('Failed to delete properties for the user!');
    }
    return 'All properties deleted successfully';
  }
}
