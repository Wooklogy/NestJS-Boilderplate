import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiConsumes } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';

// 로컬 파일 저장 위치
export const LOCAL_ATTACH_SAVE_PATH: string = path.join(
  __dirname,
  '../../',
  'public',
);

// 단일 파일 업로드시
export const CustomFileUpload = (field: string, options?: MulterOptions) => {
  return applyDecorators(
    UseInterceptors(FileInterceptor(field, options)),
    ApiConsumes('multipart/form-data'),
  );
};

// 멀티 파일 업로드시
export const CustomFileUploads = (
  field: string,
  maxCount?: number,
  options?: MulterOptions,
) => {
  return applyDecorators(
    UseInterceptors(FilesInterceptor(field, maxCount, options)),
    ApiConsumes('multipart/form-data'),
  );
};

// 로컬에 파일 저장
export const multerOptions: MulterOptions = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      if (!existsSync(LOCAL_ATTACH_SAVE_PATH)) {
        // public 폴더가 존재하지 않을시, 생성합니다.
        mkdirSync(LOCAL_ATTACH_SAVE_PATH);
      }

      callback(null, LOCAL_ATTACH_SAVE_PATH);
    },
    filename(req, file, callback) {
      file['uuid'] = randomUUID();
      callback(null, `${file['uuid']}${path.extname(file.originalname)}`);
    },
  }),
};
