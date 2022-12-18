import { BaseQuery } from '@common/base/base.query';
import { LOCAL_ATTACH_SAVE_PATH } from '@config/file.config';
import { MyLogger } from '@config/logger.config';
import { Injectable, Logger, Res, UploadedFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { DataSource, Repository } from 'typeorm';
import {
  CreateFileDto,
  FilteringFileDto,
  RequestFileDto,
} from './dto/request-file.dto';
import { ResponseFileDto } from './dto/response-file.dto';
import { File } from './entities/file.entity';

@Injectable()
export class FileService {
  constructor(
    private readonly basequery: BaseQuery,
    private readonly datasource: DataSource,
    private readonly logger: MyLogger,
    @InjectRepository(File)
    private readonly fileRepo: Repository<File>,
  ) {}
  async upload(
    file: Express.Multer.File,
    dto: RequestFileDto,
  ): Promise<ResponseFileDto> {
    const result = await this.datasource.transaction(async (manager) => {
      try {
        const createDto: CreateFileDto = new CreateFileDto();
        createDto.mime_type = file.mimetype;
        createDto.extension = file.mimetype.split('/')[1];
        createDto.origin_name = file.originalname;
        createDto.size = file.size;
        createDto.uuid = file['uuid'];
        createDto.uploader_id = dto.uploader_id;
        createDto.path = file.path;
        const fileData: File = await manager.save(
          File,
          this.fileRepo.create(createDto),
        );
        return fileData;
      } catch (err) {
        this.logger.error(`Error: ${err}`, FileService.name);
      }
    });

    const response: ResponseFileDto = plainToInstance(ResponseFileDto, result);

    return response;
  }

  async getFiles(dto: FilteringFileDto): Promise<ResponseFileDto[]> {
    const queryResult = this.basequery.get(File, dto);
    if (dto?.mime_type)
      queryResult.andWhere(`mime_type = :mime_type`, {
        mime_type: dto.mime_type,
      });
    if (dto?.origin_name)
      queryResult.andWhere(`origin_name = :origin_name`, {
        origin_name: dto.origin_name,
      });
    if (dto?.path) queryResult.andWhere(`path = :path`, { path: dto.path });
    if (dto?.extension)
      queryResult.andWhere(`extension = :extension`, {
        extension: dto.extension,
      });
    if (dto?.uuid) queryResult.andWhere(`uuid = :uuid`, { uuid: dto.uuid });

    const models: File[] = await queryResult.getRawMany();
    const result: ResponseFileDto[] = plainToInstance(ResponseFileDto, models);
    return result;
  }

  async downloadFile(res: Response, uuid: string): Promise<ResponseFileDto> {
    const model: File = await this.fileRepo.findOne({ where: { uuid: uuid } });
    const responseModel = plainToInstance(ResponseFileDto, model);
    res.download(
      `${LOCAL_ATTACH_SAVE_PATH}/${responseModel.uuid}.${responseModel.extension}`,
    );
    return responseModel;
  }
}
