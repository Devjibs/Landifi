import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Property, PROPERTYMODEL } from './schema/property.schema';
import { Model } from 'mongoose';
import { CustomRequest } from 'src/common/interfaces/request.interface';
import { QueryPropertyDto } from './dto/query-property.dto';
import { SearchPropertyDto } from './dto/search-property.dto';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import {
  LANDLORD_MODEL,
  LandlordDocument,
} from 'src/landlords/schemas/landlord.schema';
import { ImageType } from 'src/common/types/index.type';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(PROPERTYMODEL) private propertyModel: Model<Property>,
    @InjectModel(LANDLORD_MODEL) private landlordModel: Model<LandlordDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async findAll(queryPropertyDto: QueryPropertyDto) {
    const { page = 1, limit = 20 } = queryPropertyDto;

    const allProperties = await this.propertyModel
      .find()
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .populate(
        'landlord',
        '-updatedAt -isVerified -createdAt -leases -purchases -properties',
      );

    if (!allProperties) {
      throw new NotFoundException('Failed to fetch properties!');
    }
    if (allProperties.length === 0) {
      return [];
    }
    return allProperties;
  }

  async findOne(propertyId: string) {
    const property = await this.propertyModel
      .findById(propertyId)
      .populate(
        'landlord',
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
      !searchPropertyDto.category &&
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
    // TODO: Get existing images and delete them from cloudinary

    // TODO: Upload new images to cloudinary

    // TODO: Attach the new image data to the updated property
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

    const propertyToBeDeleted = await this.propertyModel.findOne({
      _id: propertyId,
      landlord: userId,
    });

    // Extract the images array from the property to be deleted
    const { images } = propertyToBeDeleted;

    // Extract the images public_id
    const imagesIdArr = images.map((img: ImageType) => img.public_id);

    // Delete all the images with their IDs
    await this.cloudinaryService.deleteMultipleImages(imagesIdArr);

    const deletedProperty = await this.propertyModel.findOneAndDelete({
      _id: propertyId,
      landlord: userId,
    });

    if (!deletedProperty) {
      throw new NotFoundException('Property not found!');
    }

    await this.landlordModel
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
      landlord: userId,
    });
    if (!deletedProperties) {
      throw new NotFoundException('Failed to delete properties for the user!');
    }
    return 'All properties deleted successfully';
  }

  async findAllPropertiesForLandlord(
    queryPropertyDto: QueryPropertyDto,
    userId,
  ) {
    const { page = 1, limit = 20 } = queryPropertyDto;

    const allProperties = await this.propertyModel
      .find({ landlord: userId })
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .populate(
        'landlord',
        '-updatedAt -isVerified -createdAt -leases -purchases -properties',
      );

    if (!allProperties) {
      throw new NotFoundException('Failed to fetch properties for user!');
    }
    if (allProperties.length === 0) {
      return [];
    }
    return allProperties;
  }
}
