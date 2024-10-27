import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

type ImageData = {
  secure_url: string;
  public_id: string;
};

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
  async uploadPropertyImage(file: Express.Multer.File): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'landifi/properties',
        },
        (error, result) => {
          if (error) {
            console.log(error);

            return reject(
              new BadRequestException('Image upload failed', error.message),
            );
          }

          // const url = cloudinary.url(result.public_id, {
          //   transformation: [
          //     {
          //       quality: 'auto',
          //       fetch_format: 'auto',
          //     },
          //     {
          //       width: 1200,
          //       height: 1200,
          //       crop: 'fill',
          //       gravity: 'auto',
          //     },
          //   ],
          // });

          // console.log(url);

          const { secure_url, public_id } = result;
          const imageData = { secure_url, public_id };
          resolve(imageData);
        },
      );

      // Using streamifier to upload from buffer
      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }

  // Multiple images upload for properties
  async uploadMultiplePropertyImages(
    files: Express.Multer.File[],
  ): Promise<ImageData[]> {
    const uploadPromises = files.map((file) => this.uploadPropertyImage(file)); // Upload each image
    return Promise.all(uploadPromises); // Return array of uploaded data
  }

  // Single property image upload
  async uploadUserImage(file: Express.Multer.File): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'landifi/users',
        },
        (error, result) => {
          if (error) {
            console.log(error);

            return reject(
              new BadRequestException('Image upload failed', error.message),
            );
          }

          const { secure_url, public_id } = result;
          const imageData = { secure_url, public_id };
          resolve(imageData);
        },
      );

      // Using streamifier to upload from buffer
      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }
}
