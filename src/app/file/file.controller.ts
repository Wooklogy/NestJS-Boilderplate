import { CustomFileUpload, multerOptions } from '@config/file.config';
import { ApiGuard } from '@config/guard/guard.decorator';
import {
  Controller,
  Post,
  Body,
  UploadedFile,
  Get,
  Query,
  Param,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { FilteringFileDto, RequestFileDto } from './dto/request-file.dto';
import { FileService } from './file.service';

@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiOperation({
    summary: '단일 파일 업로드',
    description: '단일 파일을 업로드하기 위한 실험적 API',
    deprecated: true,
  })
  @Post('upload')
  @CustomFileUpload('file', multerOptions)
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: RequestFileDto,
  ) {
    return this.fileService.upload(file, dto);
  }

  // @ApiOperation({
  //   summary: '파일 찾기',
  //   description: '필터를 활용해 파일을 찾습니다',
  // })
  @ApiGuard({
    summary: '파일 찾기',
    description: '필터를 활용해 파일을 찾습니다',
  })
  @Get('get')
  getFiles(@Query() dto: FilteringFileDto) {
    return this.fileService.getFiles(dto);
  }

  @ApiOperation({ summary: '파일 다운로드' })
  @Get('download/:uuid')
  downloadFile(@Param('uuid') uuid: string, @Res() res: Response) {
    return this.fileService.downloadFile(res, uuid);
  }
}
