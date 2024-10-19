import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class ImageUploaderService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.get<string>('cloudinary.cloud_name'),
      api_key: configService.get<string>('cloudinary.api_key'),
      api_secret: configService.get<string>('cloudinary.api_secret'),
    });
  }
}
