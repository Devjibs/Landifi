import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
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
import { Role } from 'src/common/enums/index.enum';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(PROPERTYMODEL) private propertyModel: Model<Property>,
    @InjectModel(LANDLORD_MODEL) private landlordModel: Model<LandlordDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createPropertyDto: CreatePropertyDto,
    images: Array<Express.Multer.File>,
    req: CustomRequest,
  ) {
    const { userId } = req;

    if (images.length === 0) {
      throw new BadRequestException(
        'Image upload is required to create new property',
      );
    }

    if (images.length > 5) {
      throw new BadRequestException(
        'You can only upload maximum of 5 images per property!',
      );
    }

    const propertyImagesArray =
      await this.cloudinaryService.uploadMultiplePropertyImages(images);

    if (propertyImagesArray.length === 0) {
      throw new ConflictException('Failed to upload property images!');
    }

    const newProperty = new this.propertyModel({
      ...createPropertyDto,
      images: propertyImagesArray,
      landlord: userId,
    });
    const savedProperty = await newProperty.save();
    if (!savedProperty) {
      throw new InternalServerErrorException('Failed to create new property!');
    }
    await this.landlordModel.findOneAndUpdate(
      { _id: userId, userType: Role.LANDLORD },
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

    const deletedProperty =
      await this.propertyModel.findByIdAndDelete(propertyId);
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
