import {
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

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<Property>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto, req: CustomRequest) {
    const { userId } = req;
    const createdProperty = await this.propertyModel.create({
      ...createPropertyDto,
      owner: userId,
    });
    if (!createdProperty) {
      throw new InternalServerErrorException('Failed to create new property!');
    }
    return createdProperty;
  }

  async findAll() {
    return this.propertyModel.find({});
  }

  async findOne(propertyId: string) {
    const property = await this.propertyModel.findById(propertyId);
    if (!property) {
      throw new NotFoundException('Property not found!');
    }
    return property;
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

  async remove(propertyId: string, req) {
    const deletedAnimal =
      await this.propertyModel.findByIdAndDelete(propertyId);
    if (!deletedAnimal) {
      throw new NotFoundException('Failed to delete property!');
    }
    return 'Property deleted successfully';
  }

  async removeAll(userId: string) {
    const deletedAnimals = await this.propertyModel.deleteMany({
      owner: userId,
    });
    if (!deletedAnimals) {
      throw new NotFoundException('Failed to delete properties for the user!');
    }
    return 'All properties deleted successfully';
  }
}
