import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SaleDocument, SALEMODEL } from './schemas/sale.schema';
import { Model } from 'mongoose';
import {
  LANDLORD_MODEL,
  LandlordDocument,
} from 'src/landlords/schemas/landlord.schema';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { CustomRequest } from 'src/common/interfaces/request.interface';
import { Role } from 'src/common/enums/index.enum';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(SALEMODEL) private saleModel: Model<SaleDocument>,
    @InjectModel(LANDLORD_MODEL) private landlordModel: Model<LandlordDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createSaleDto: CreateSaleDto,
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
      await this.cloudinaryService.uploadMultipleImages(
        images,
        'properties',
      );

    if (propertyImagesArray.length === 0) {
      throw new ConflictException('Failed to upload property images!');
    }

    const newProperty = new this.saleModel({
      ...createSaleDto,
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
    return `This action returns all sales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sale`;
  }

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
}
