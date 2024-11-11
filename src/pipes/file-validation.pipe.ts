import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(images: Array<Express.Multer.File> | any) {
    // Check if images is an array
    if (!Array.isArray(images) || images.length === 0) {
      throw new BadRequestException('No images uploaded');
    }

    // Log to check the incoming files
    console.log('Validator part', images);

    // Validate file size and type
    images.forEach((file) => {
      if (file.size > 1024 * 1024 * 5) {
        throw new BadRequestException(
          'File size too large. Max file size is 5MB',
        );
      }

      if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
        throw new BadRequestException(
          'Invalid file type. Only JPEG or PNG is allowed',
        );
      }
    });

    return images; // Return validated files
  }
}
