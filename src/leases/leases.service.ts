import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotImplementedException,
} from '@nestjs/common';
import { CreateLeaseDto } from './dto/create-lease.dto';
import { UpdateLeaseDto } from './dto/update-lease.dto';
import { CustomRequest } from 'src/common/interfaces/request.interface';
import { InjectModel } from '@nestjs/mongoose';
import {
  LANDLORD_MODEL,
  LandlordDocument,
} from 'src/landlords/schemas/landlord.schema';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { Role } from 'src/common/enums/index.enum';
import { LeaseDocument, LEASEMODEL } from './schemas/lease.schema';
import { ImageType } from 'src/common/types/index.type';

@Injectable()
export class LeasesService {
  constructor(
    @InjectModel(LEASEMODEL) private leaseModel: Model<LeaseDocument>,
    @InjectModel(LANDLORD_MODEL) private landlordModel: Model<LandlordDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createLeaseDto: CreateLeaseDto,
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
      await this.cloudinaryService.uploadMultipleImages(images, 'properties');

    if (propertyImagesArray.length === 0) {
      throw new ConflictException('Failed to upload property images!');
    }

    const newProperty = new this.leaseModel({
      ...createLeaseDto,
      images: propertyImagesArray,
      landlord: userId,
    });
    const savedProperty = await newProperty.save();
    if (!savedProperty) {
      throw new InternalServerErrorException('Failed to create new property!');
    }

    const updateLandlordProperty = await this.landlordModel.findOneAndUpdate(
      { _id: userId, userType: Role.LANDLORD },
      { $push: { properties: savedProperty._id } },
      { new: true },
    );

    if (!updateLandlordProperty) {
      throw new InternalServerErrorException(
        'Property created but not updated for the landlord.',
      );
    }
    return savedProperty;
  }

  async update(
    propertyId: string,
    updateLeaseDto: UpdateLeaseDto,
    req: CustomRequest,
    files: Array<Express.Multer.File>,
  ) {
    const { userId } = req;

    const propertyToBeUpdated = await this.leaseModel.findOne({
      _id: propertyId,
      landlord: userId,
    });

    // Check number of images
    if (files && files.length > 5) {
      throw new BadRequestException(
        'You can only upload maximum of 5 images per property!',
      );
    }

    // let newImagesArr: ImageType[] | [];

    if (files && files.length > 0 && files.length <= 5) {
      // Get existing images
      const { images } = propertyToBeUpdated;
      // Extract the images public_id
      const imagesIdArr = images.map((img: ImageType) => img.public_id);

      // Delete all the images with their IDs
      await this.cloudinaryService.deleteMultipleImages(imagesIdArr);

      // Upload new images
      const propertyImagesArray =
        await this.cloudinaryService.uploadMultipleImages(files, 'properties');

      if (propertyImagesArray.length === 0) {
        throw new ConflictException('Failed to upload property images!');
      }

      // Attach the new image data to the updated property
      const updatedProperty = await this.leaseModel.findByIdAndUpdate(
        propertyId,
        { ...updateLeaseDto, images: propertyImagesArray },
        { new: true },
      );

      if (!updatedProperty) {
        throw new NotImplementedException(`Property update failed!`);
      }

      return updatedProperty;
    }

    // Attach the new image data to the updated property
    const updatedProperty = await this.leaseModel.findByIdAndUpdate(
      propertyId,
      { ...updateLeaseDto },
      { new: true },
    );

    if (!updatedProperty) {
      throw new NotImplementedException(`Property update failed!`);
    }

    return updatedProperty;
  }

  // findAll() {
  //   return `This action returns all leases`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} lease`;
  // }

  // update(id: number, updateLeaseDto: UpdateLeaseDto) {
  //   return `This action updates a #${id} lease`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} lease`;
  // }
}
