import { AccessToken, JwtOptions, JwtPayload } from '@config/guard/jwt.config';
import { MyLogger } from '@config/logger.config';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { DataSource, Repository } from 'typeorm';
import {
  CreateAccountDto,
  FilteringAccountDto,
  LoginAccountDto,
  UpdateAccountDto,
} from './dto/request-account.dto';
import { ResponseAccountDto } from './dto/response-account.dto';
import { Account } from './entities/account.entity';
import * as bcrypt from 'bcrypt';
import { BaseQuery } from '@common/base/base.query';

@Injectable()
export class AccountService {
  constructor(
    private readonly basequery: BaseQuery,
    private readonly datasource: DataSource,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    private readonly logger: MyLogger,
    private readonly jwtService: JwtService,
    private readonly jwtOptions: JwtOptions,
  ) {}
  async create(
    createAccountDto: CreateAccountDto,
  ): Promise<ResponseAccountDto> {
    // 트렌젝션
    const result = await this.datasource.transaction(async (manager) => {
      // email 중복검사
      const uniqueEmail = await manager.findOne(Account, {
        where: { email: createAccountDto.email },
      });

      if (uniqueEmail?.email)
        throw new HttpException(
          '이미 존재하는 이메일입니다.',
          HttpStatus.BAD_REQUEST,
        );
      const saved_object = await manager.save(
        Account,
        this.accountRepo.create(createAccountDto),
      );
      const response: ResponseAccountDto = plainToInstance(
        ResponseAccountDto,
        saved_object,
      );

      return response;
    });
    this.logger.log('Success Created User', AccountService.name);

    return result;
  }

  async find(dto: FilteringAccountDto): Promise<ResponseAccountDto[]> {
    const queryResult = this.basequery.get(Account, dto);
    if (dto?.email) queryResult.where(`email = :email`, { email: dto.email });
    if (dto?.name) queryResult.andWhere(`name = :name`, { name: dto.name });
    if (dto?.role) queryResult.andWhere(`role = :role`, { role: dto.role });
    if (dto?.uuid) queryResult.andWhere(`uuid = :uuid`, { uuid: dto.uuid });
    const models: Account[] = await queryResult.getRawMany();
    const result: ResponseAccountDto[] = plainToInstance(
      ResponseAccountDto,
      models,
    );
    return result;
  }

  async update(
    uuid: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<ResponseAccountDto> {
    const result: ResponseAccountDto = await this.datasource.transaction(
      async (manager) => {
        const updatedModel = await manager.update(
          Account,
          { uuid: uuid },
          updateAccountDto,
        );
        if (updatedModel.affected !== 1)
          throw new HttpException(
            '유저 정보가 존재하지 않습니다.',
            HttpStatus.BAD_REQUEST,
          );
        const reponseModel: ResponseAccountDto = await manager.findOne(
          Account,
          { where: { uuid: uuid } },
        );
        return plainToInstance(ResponseAccountDto, reponseModel);
      },
    );

    return result;
  }

  async remove(uuid: string): Promise<ResponseAccountDto> {
    const result = await this.datasource.transaction(async (manager) => {
      const updatedModel = await manager.update(
        Account,
        { uuid: uuid },
        { is_deleted: true, deleted_at: new Date() },
      );
      if (updatedModel.affected !== 1)
        throw new HttpException(
          '유저 정보가 존재하지 않습니다.',
          HttpStatus.BAD_REQUEST,
        );
      const reponseModel: ResponseAccountDto = await manager.findOne(Account, {
        where: { uuid: uuid },
      });
      return plainToInstance(ResponseAccountDto, reponseModel);
    });

    return result;
  }

  async getMyInfoByToken(req: Request): Promise<ResponseAccountDto> {
    const token: any = req.headers[AccessToken];
    const payload: JwtPayload = this.jwtService.verify(
      token,
      this.jwtOptions.JwtVerifyAccessOptions(),
    );

    const model: ResponseAccountDto[] = await this.find({
      email: payload.email,
    });

    return model[0];
  }

  async login(dto: LoginAccountDto): Promise<ResponseAccountDto> {
    const model: Account = await this.accountRepo.findOne({
      where: { email: dto.email },
    });

    if (!model)
      throw new HttpException('가입되지 않은 이메일', HttpStatus.NOT_FOUND);

    // 비밀번호 인증
    const checkPW = await bcrypt.compare(dto.password, model.password);
    if (!checkPW)
      throw new HttpException('비밀번호가 틀림', HttpStatus.BAD_REQUEST);
    return plainToInstance(ResponseAccountDto, model);
  }

  getAccessToken(account: ResponseAccountDto | Account): string {
    const token = this.jwtService.sign(
      { email: account.email, role: account.role },
      this.jwtOptions.JwtSignAccessOptions(),
    );
    return token;
  }

  getRefreshToken(account: ResponseAccountDto | Account): string {
    const token = this.jwtService.sign(
      { email: account.email, role: account.role },
      this.jwtOptions.JwtSignRefreshOptions(),
    );
    return token;
  }
}
