import { BadRequestException, Injectable, NotImplementedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { ImageType } from '../types/index.type';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.get<string>('cloudinary.cloud_name'),
      api_key: configService.get<string>('cloudinary.api_key'),
      api_secret: configService.get<string>('cloudinary.api_secret'),
    });
  }

  // Single property image upload
  async uploadImage(
    file: Express.Multer.File,
    folderPath: string,
  ): Promise<ImageType> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: `landifi/${folderPath}`,
        },
        (error, result) => {
          if (error) {
            console.log(error);

            return reject(
              new BadRequestException('Image upload failed', error.message),
            );
          }
          const { secure_url, public_id } = result;
          const ImageType = { secure_url, public_id };
          resolve(ImageType);
        },
      );

      // Using streamifier to upload from buffer
      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }

  // Multiple images upload for properties
  async uploadMultipleImages(
    files: Express.Multer.File[],
    folderPath: string,
  ): Promise<ImageType[]> {
    const uploadPromises = files.map((file) =>
      this.uploadImage(file, folderPath),
    ); // Upload each image
    return Promise.all(uploadPromises); // Return array of uploaded data
  }

  // Single image deletion
  async deleteImage(publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Failed to delete image:', error);
      throw new NotImplementedException('Image deletion failed');
    }
  }

  // Multiple images deletion
  async deleteMultipleImages(publicIds: string[]) {
    try {
      const deletionResults = await Promise.all(
        publicIds.map((id) => cloudinary.uploader.destroy(id)),
      );
      return deletionResults;
    } catch (error) {
      console.error('Failed to delete images:', error);
      throw new NotImplementedException('Multiple image deletion failed');
    }
  }
}
