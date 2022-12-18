import { AllowAuthRole } from '@common/types/role.type';
import { ApiGuard } from '@config/guard/guard.decorator';
import { MyLogger } from '@config/logger.config';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AccountService } from './account.service';
import {
  CreateAccountDto,
  FilteringAccountDto,
  LoginAccountDto,
  UpdateAccountDto,
} from './dto/request-account.dto';
import { ResponseAccountDto } from './dto/response-account.dto';

@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly logger: MyLogger,
  ) {}

  @Post()
  @ApiOperation({
    summary: '회원 생성 API',
  })
  async create(
    @Body() createAccountDto: CreateAccountDto,
    @Res() res: Response,
  ) {
    this.logger.log('Try CreateUser', AccountController.name);
    const model: ResponseAccountDto = await this.accountService.create(
      createAccountDto,
    );
    res.setHeader('access_token', this.accountService.getAccessToken(model));
    res.setHeader('refresh_token', this.accountService.getRefreshToken(model));
    res.send(model);

    return res;
  }

  @Get()
  @ApiGuard({ summary: '토큰으로 회원정보 가져오기' }, [
    AllowAuthRole.Admin,
    AllowAuthRole.User,
  ])
  async getMyInfoByToken(@Req() req: Request) {
    return await this.accountService.getMyInfoByToken(req);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('/login')
  async login(@Body() dto: LoginAccountDto, @Res() res: Response) {
    const model: ResponseAccountDto = await this.accountService.login(dto);
    res.setHeader('access_token', this.accountService.getAccessToken(model));
    res.setHeader('refresh_token', this.accountService.getRefreshToken(model));
    res.send(model);
    return res;
  }

  @ApiGuard(
    {
      summary: '회원 필터링 검색 테스트',
    },
    [AllowAuthRole.User],
  )
  @Get('filter')
  findOne(@Query() dto: FilteringAccountDto) {
    return this.accountService.find(dto);
  }

  @ApiGuard({ summary: '유저 정보 수정' }, [AllowAuthRole.User])
  @Patch(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountService.update(uuid, updateAccountDto);
  }

  @ApiGuard({ summary: '유저 정보 삭제(SOFT DELETE)' }, [AllowAuthRole.User])
  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.accountService.remove(uuid);
  }
}
