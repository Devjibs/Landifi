import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
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
      await this.cloudinaryService.uploadMultiplePropertyImages(images);

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

  findAll() {
    return `This action returns all leases`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lease`;
  }

  update(id: number, updateLeaseDto: UpdateLeaseDto) {
    return `This action updates a #${id} lease`;
  }

  remove(id: number) {
    return `This action removes a #${id} lease`;
  }
}
