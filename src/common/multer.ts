import { UnsupportedMediaTypeException } from '@nestjs/common';
import multer from 'multer';
import path from 'path';

// Multer config
export default multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      cb(new UnsupportedMediaTypeException('File type is not supported'));
      return;
    }
    cb(null, true);
  },
});
