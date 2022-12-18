import { MyLogger } from '@config/logger.config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { RequestBaseFlitering } from './base.dto';

@Injectable()
export class BaseQuery {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: MyLogger,
  ) {}

  get(entity: any, dto: RequestBaseFlitering): SelectQueryBuilder<any> {
    try {
      const query = this.dataSource
        .createQueryBuilder()
        .from(entity, entity.name);
      if (dto?.is_deleted !== undefined)
        query.andWhere(`is_deleted IS ${dto.is_deleted}`);
      if (dto?.is_usable !== undefined)
        query.andWhere(`is_usable IS ${dto.is_usable}`);
      if (dto?.create_start && dto?.create_end) {
        query.andWhere(`created_at BETWEEN :start AND :end`, {
          start: dto.create_start,
          end: dto.create_end,
        });
      }
      if (dto?.updated_start && dto?.updated_end) {
        query.andWhere(`updated_at BETWEEN :start AND :end`, {
          start: dto.updated_start,
          end: dto.updated_end,
        });
      }
      if (dto?.delete_start && dto?.delete_end) {
        query.andWhere(`deleted_at BETWEEN :start AND :end`, {
          start: dto.delete_start,
          end: dto.delete_start,
        });
      }

      return query;
    } catch {
      this.logger.error('유효하진 Entity입니다.', BaseQuery.name);
      throw new HttpException(
        '유효하지 않은 도메인 접근',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
