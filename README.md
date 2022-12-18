<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>
<div style="font-size:12px;"> <b>작성자 : </b> 장현욱 (wkdgusdnr55@gmail.com)</div>

# 목차

1. [문서](#문서)
2. [서버실행](#raised_hands-서버-실행)
3. [아키텍쳐](#books-아키텍쳐)
4. [API Quick Start](#bookmark-api-quick-start)
5. [MVC코드설명](#mag-MVC-코드-설명)
   - [Entity](#page_with_curl-entity)
   - [DTO](#file_cabinet-dto)
   - [Controller](#door-controller)
   - [Service](#safety_pin-service)
   - [Modulel](#briefcase-module)
6. [File코드설명](#open_file_folder-File-코드-설명)
   - [Config](#gear-File-Config)
   - [Upload](#outbox_tray-File-Upload)
   - [Download](#inbox_tray-File-Download)

# 문서

- :green_book: **Open API(Swagger)** : http://localhost:8084/api
- :closed_book: **Official Doc** : https://docs.nestjs.com/
- :blue_book: **Author Doc** : https://velog.io/@artlogy/series/Nest.js

# :raised_hands: 서버 실행

서버를 빠르게 실행하는 법입니다.

### dev

```bash
# 개발환경으로 실행
$ npm install
$ npm start:dev
```

### product

```bash
# 배포환경으로 실행
$ npm install
$ npm start:prod
```

### debug

```bash
# 디버그환경으로 실행
$ npm install
$ npm start:debug
```

### build

```bash
# 서버 빌드 (빌드 파일이 생깁니다.)
$ npm install
$ npm build
```

# :books: 아키텍쳐

boilerplate의 디렉토리 구조입니다.

```shell
📦 src
 ┣ 📂 app # API 단위로 MVC를 정의하는 곳
 ┃ ┣ 📂 account # CRUD와 AUTH 전략의 샘플코드를 확인 할 수 있음
 ┃ ┣ 📂 file # File전략과 업로드/다운로드 코드를 확인 할 수 있음
 ┃ ┣ 📂 health-check # Test
 ┃┣ 📜 app.module.ts  # module 등록을 하는 곳
 ┃┣ 📜 config.module.ts # config, module, provider등 글로벌 Singleton Instance를 등록하는 곳
 ┣ 📂 common # 반복되는 코드의 경우 이곳에서 정의하여 중복코드를 줄여줌
 ┃ ┣ 📂 base # baseEntity, baseQuery등 반복되는 코드를 정의하는 곳
 ┃ ┣ 📂 types # 반복 되는 타입형을 정의하는 곳  (class, type, enum)

 ┣ 📂 config # 앱 전체에 반영되는 설정을 정의하는 곳
 ┃ ┣ 📂 env # .env
 ┃ ┣ 📂 filters # filters를 정의하는 곳
 ┃ ┣ 📂 guard # guard(security)를 정의하는 곳
 ┃ ┣ 📂 interceptors # interceptor를 정의하는 곳
 ┃ ┣ 📂 pipes # pipe를 정의하는 곳
 ┃ ┣ 📜 cors.config.ts # cors 전략에 대한 설정
 ┃ ┣ 📜 database.config.ts # database의 기본 설정
 ┃ ┣ 📜 file.config.ts # file에 대한 기본 설정
 ┃ ┣ 📜 logger.config.ts # logger에 대한 기본 설정
 ┃ ┣ 📜 swagger.config.ts # swagger에 대한 기본 설정

 ┣ 📜 main.ts
```

# :bookmark: API Quick Start

API를 쉽고 빠르게 만드는법을 알아봅시다.

### 1. 경로 변경

하나의 MVC단위로 폴더가 존재해야 하기 때문에 app폴더로 경로를 바꿔주세요.

```bash
cd src/app
```

### 2. nest g res {name}

nest에서 기본적으로 제공하는 매크로 명령인 `nest g res`를 사용해 간단하게 구조를 만들 수 있습니다.

```bash
nest g res sample
```

- 선택문구가 출력 될 텐데 **REST API**를 선택하면 됩니다.
- "Would you like to generate CRUD entry points"는 CRUD 앤트리 포인트를 자동으로 만들지 물어보는 것입니다. 일단은 Y를 선택 해주겠습니다.
- 다음과 같이 파일구조가 생성되었다면 성공입니다.

![image](https://user-images.githubusercontent.com/117614036/204183317-ea4359a7-cd6b-4cbc-8055-11ee1ac0df39.png)

> 기본 매크로 명령어는 `nest --help`를 통해 확인 할 수 있습니다.

### 3. 데이터베이스에 적용

우리가 만든 sample을 실제 데이터베이스와 앱에 적용 할려면 다음과 같은 과정이 필요합니다.

#### 1. module 설정
앱에서 사용 할 프로바이더와 엔티티들을 앱모듈에 등록하기 전 샘플모듈에 하나로 모아주는 작업입니다. </br>
**sample.module.ts**

```ts
import { Module } from '@nestjs/common';
import { SampleService } from './sample.service';
import { SampleController } from './sample.controller';
import { Sample } from './entities/sample.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Sample])], // typeorm에 등록해주는 작업입니다.
  controllers: [SampleController], // 컨트롤러를 app에 등록해주기 위한 작업입니다.
  providers: [SampleService], // 서비스를 app에 등록해주기 위한 작업입니다.
})
export class SampleModule {}

export const SampleEntities = [Sample]; //database에 등록해주기 위한 작업입니다.
```

#### 2. module 등록
app.module.ts에서 앱에서 사용될 모듈을 추가해 줍니다.</br>
**app.module.ts**

```ts
import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { FileModule } from './file/file.module';
import { CustomConfigModule } from './config.module';
import { SampleModule } from './sample/sample.module';

@Module({
  imports: [CustomConfigModule, AccountModule, FileModule, SampleModule],
})
export class AppModule {}
```

#### 3. database 설정
DB 설정에서 테이블로써 반영 될 entity를 추가합니다.</br>
**database.config.ts**

```ts
import { AccountEntities } from '@app/account/account.module';
import { FileEntities } from '@app/file/file.module';
import { SampleEntities } from '@app/sample/sample.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const dataBaseConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'mariadb',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
    // ADD ENTITIES
    entities: [...AccountEntities, ...FileEntities, ...SampleEntities], //이곳에 등록해줘야 실 DB에 테이블이 생성됩니다.
  }),
  inject: [ConfigService],
};
```

### Sample Entity 만들어보기
샘플 엔티티를 간단히 정의하고 실제 데이터베이스에 반영을 확인해 보겠습니다.
```ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sample')
export class Sample {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '이름' })
  @IsString()
  @Column()
  name: string;
}
```
- `AUTO_INCREMENT`가 적용된 기본 키 id를 넘버타입으로 선언했습니다.
- id같은 경우 자동으로 할당되기 때문에 ApiProperty를 통해 스웨거에 등록 할 필요가 없습니다.
- 문자열 타입으로 name 컬럼을 선언했습니다.

서버를 실행하고 다음과 같이 실제 DB상에 반영되면 성공입니다.
![image](https://user-images.githubusercontent.com/51950301/204454085-283be448-f4ca-4a16-b799-fcd07b0a58cb.png)

### 간단한 API 만들기
TypeORM을 활용하여 DB를 제어해 간단한 API를 만들어 보겠습니다. </br>
원하는 형태의 요청을 받고 데이터를 생성하여 DB에 삽입 한 후 원하는 형태로 응답을 반환해 봅시다. </br>
가장먼저 해야 할 것은 원하는 요청/응답을 만드는 일이라고 볼 수 있는 </br>
request와 response에 매핑될 DTO를 만들어 주는 것입니다. </br>

#### Request DTO 만들기
```ts
import { PickType } from '@nestjs/swagger';
import { Sample } from '../entities/sample.entity';

export class CreateSampleDto extends PickType(Sample, ['name']) {}
```
요청을 받을 때 id는 자동할당 되기에 name값만 받으면 됩니다. </br>
때문에 `PickType`을 상속받아 Sample model에서 name만 받도록 설정하였습니다. </br>

#### Response DTO 만들기
```ts
import { PartialType } from '@nestjs/swagger';
import { Sample } from '../entities/sample.entity';

export class ResponseSampleDto extends PartialType(Sample) {}
```
응답은 모든 내용을 보내 줄 것이니 model을 PartialType으로 상속받아 만들어줬습니다.

#### Create 기능 만들기
생성뿐만 아니라 DB의 데이터가 변경되는 모든 작업은 데이터의 무결성을 지키기 위해 트렌젝션이 필수적입니다. </br>
때문에 트렌젝션을 적용하여 데이터를 생성해보겠습니다.

**sample.service.ts**

```ts
  ...
  
  // 트렌젝션을 사용하기 위해 DataSource를 주입받습니다. (DataSource는 하나의 DB인스턴스라고 생각하면 됩니다.)
  constructor(private readonly datasource: DataSource) {}

  async create(createSampleDto: CreateSampleDto): Promise<ResponseSampleDto> {
    // 트렌젝션은 다음과 같이 사용 가능합니다.
    // 내부에서 에러가 발생되면 manager를 이용한 DB와 관련된 작업이 취소되고 되돌아 갑니다.
    // 여기서 manager 파라미터는 해당 datasource에 있는 entityManager입니다.
    const resBody: ResponseSampleDto = await this.datasource.transaction(
      async (manager) => {
        // create는 해당 모델로 값을 할당한 모델하나를 만드는 작업입니다. (Insert는 아니라는 점 주의하세요.)
        const new_model: Sample = manager.create(Sample, {
          ...createSampleDto,
        });

        // save를 통해 table에 데이터가 insert됩니다.
        const inserted_model: Sample = await manager.save(new_model);

        // plainToInstance를 통해 Sample타입의 객체를 ResponseSampleDto로 매핑한 후 반환해줍니다.
        return plainToInstance(ResponseSampleDto, inserted_model);
      },
    );
    return resBody;
  }
  ...
```
테스트를 위해 스웨거에 라우터를 추가해줍니다.
**sample.controller.ts**
```ts
 @ApiOperation({
    summary: 'Sample Create',
    description: '샘플로 만든 Create 기능입니다.',
  })
  @Post()
  create(@Body() createSampleDto: CreateSampleDto) {
    return this.sampleService.create(createSampleDto);
  }
```
[local swagger](http://localhost:8084/api)에서 테스트를 하여 다음과 같이 요청/응답이 된다면 성공적입니다.
![image](https://user-images.githubusercontent.com/117614036/204428352-d6d7acdc-a132-47d2-b224-fb3de6fd518b.png)
실제 DB에도 데이터가 잘 생성된 것을 확인 할 수 있습니다.
![image](https://user-images.githubusercontent.com/51950301/204454240-e649e932-af18-4dad-9fff-4fe4f64b3de6.png)


> Controller는 기능보단 라우팅이 핵심이 되어야 합니다. ( AOP 패턴의 핵심인 관심사 분리 ) </br>
때문에 본 예제에서도 Controller단은 조작하지않고 Service단에서만 기능을 구현하였습니다. </br>

---

# :mag: MVC 코드 설명

### Account

**구현된 기능**

- **회원가입 (Create)**
- **유저 삭제 (Soft-Delete)**
- **유저 정보 변경 (Update)**
- **로그인**
- **유저 검색 (Select, Filter)**
- **인증,인가(JWT)**

---

### :page_with_curl: Entity

Entity는 데이터베이스에서 Table의 기능을 하는 모델입니다. </br>
샘플 코드로 구현된 Account Entity는 다음과 같이 구현 되어 있습니다.</br>
**app/account/entities/account.entity.ts**

```ts
import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { InternalServerErrorException } from '@nestjs/common';
import { AllowAuthRole } from '@common/types/role.type';
import { baseEntityUUID } from '@common/base/base.entity';

@Entity('account')
export class Account extends baseEntityUUID {
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  @ApiProperty({
    type: String,
    description: '유저 이름',
    nullable: false,
    example: 'Artlogy',
    minLength: 1,
    maxLength: 24,
  })
  @Column({ length: 24, comment: '유저 이름', nullable: false })
  name: string;

  @IsString()
  @IsEmail()
  @MaxLength(128)
  @ApiProperty({
    type: String,
    description: '이메일',
    uniqueItems: true,
    nullable: false,
    example: 'artlogy@example.com',
  })
  @Column({ length: 128, comment: '이메일', unique: true, nullable: false })
  email: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: '패스워드',
    nullable: false,
  })
  @Column({
    length: 256,
    comment: '패스워드',
    nullable: false,
  })
  password: string;

  @IsEnum(AllowAuthRole)
  @ApiProperty({ enum: AllowAuthRole, name: 'role', description: '유저 룰' })
  @Column({
    type: 'enum',
    enum: AllowAuthRole,
    name: 'role',
    comment: '유저 룰',
  })
  role: string;

  @Column({
    length: 128,
    comment: '리플래시 토큰',
    nullable: true,
  })
  refresh_token: string;

  @BeforeInsert()
  private async pwdHashing(pwd: string): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password || pwd, 10);
    } catch (e) {
      throw new InternalServerErrorException('Password hashing error!!!');
    }
  }
}
```

**위 코드에서 쓰인 데코레이터 부터 살펴보겠습니다.**

#### TypeORM Deco

- **@Entity()** : 테이블을 만들기 위한 데코레이터
- **@Column()** : 테이블의 열을 만들기 위한 데코레이터
- **@BeforeInsert()** : 데이터가 삽입되기전 실행 될 메서드를 위한 데코레이터 </br>
  > 좀 더 자세히 알고 싶다면 다음 링크를 이용하자. </br> > [Official TypeORM](https://typeorm.io/entities) </br> > [WookLogy TypeORM](https://velog.io/@artlogy/Entity) </br>

#### ClassValidator Deco

- **@IsString()** : 데이터가 String 타입인지 유효성 검사를 위한 데코레이터
- **@MinLength()** : 데이터의 최소길이 유효성 검사를 위한 데코레이터
- **@MaxLength()** : 데이터의 최대길이 유효성 검사를 위한 데코레이터
- **@IsEmail()** : 데이터가 이메일 타입인지 유효성 검사를 위한 데코레이터
- **@IsEnum()** : 데이터가 열거형 타입인지 유효성 검사를 위한 데코레이터 </br>
  > 좀 더 자세히 알고 싶다면 다음 링크를 이용하자. </br> > [Official class-validator](https://github.com/typestack/class-validator#validation-decorators) </br> > [WookLogy class-validator](https://velog.io/@artlogy/08.-Validate)

#### Swagger Deco

- **@ApiProperty()** : 스웨거에 출력 될 데이터 스키마를 정의하기 위한 데코레이터 </br>
  > 좀 더 자세히 알고 싶다면 다음 링크를 이용하자. </br> > [Official Swagger](https://swagger.io/docs/specification/about/) </br> > [WookLogy NestJS Swagger](https://velog.io/@artlogy/07.-OpenAPI-Swagger)

#### Extend Entity

위 코드를 보면 baseEntityUUID를 상속받는데, </br>
UUID, ID, created_at등의 거의 모든 entity에서 사용되는 컬럼같은 경우 </br>
baseEntity에 정의하고 사용 할 entity에 상속하여 중복되는 코드를 줄이기 위함입니다. </br>

---

### :file_cabinet: DTO

**DTO(Data Transfer Object)** 는 요청/응답에서 보여질 데이터의 스키마를 정의하기 위한 객체입니다. </br>
DTO를 정의하는 이유는 정확하고 유효한 요청/응답을 유도하고, OpenAPI에서 스키마를 더 쉽게 보여주기 위함입니다.

**app/account/dto/request-account.dto.ts**

```ts
import { RequestBaseFlitering } from '@common/base/base.dto';
import {
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Account } from '../entities/account.entity';

export class CreateAccountDto extends PickType(Account, [
  'email',
  'name',
  'password',
  'role',
] as const) {}
export class UpdateAccountDto extends PartialType(CreateAccountDto) {}

// 검색 Dto
export class FilteringAccountDto extends PartialType(
  IntersectionType(
    RequestBaseFlitering,
    OmitType(Account, [
      'password',
      'refresh_token',
      'updated_at',
      'deleted_at',
      'created_at',
    ] as const),
  ),
) {}

// 로그인 Dto
export class LoginAccountDto extends PickType(Account, ['email', 'password']) {}
```

**app/account/dto/response-account.dto.ts**

```ts
import { OmitType, PartialType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Account } from '../entities/account.entity';

export class ResponseAccountDto extends PartialType(Account) {
  @Exclude()
  refresh_token?: string;
  @Exclude()
  password?: string;
}
```

- 하나의 테이블에 대한 정의는 Entity에서만 합니다. ( 관심사 분리 AOP )
- DTO는 Entity를 매핑하여 사용합니다.
- request는 요청시 필요한 객체를 뜻합니다.
- response는 응답 객체를 뜻합니다.

#### 매핑 타입

NestJS에서는 AOP패턴을 권장하기 때문에 모델정의는 Entity에서만 합니다.</br>
때문에 정의된 모델을 기반으로 만들어지는 DTO는 Swagger의 매핑 클래스를 이용하여 사용합니다.
</br>
> NestJS 매핑에 관하여 자세히 알고 싶다면 다음 링크를 이용하세요. </br> > [Official](https://docs.nestjs.com/openapi/mapped-types) </br> > [WookLogy](https://velog.io/@artlogy/Mapped-types) </br>

위 코드에서 사용한 데코레이터는 다음과 같습니다.

#### ClassTransformer Deco

- @Exclude() : 데이터 직렬화 매핑에서 제외해주는 데코레이터
- @Expose() : 데이터 직렬화 매핑에서 포함시켜주는 데코레이터

---

### :door: Controller

컨트롤단은 EndPoint를 매핑하는 객체입니다. </br>
다른 말로는 URL 라우팅을 담당합니다. </br>
**app/account/account.controller.ts**

```ts
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
```

**위 코드에 사용 된 데코레이터를 살펴보도록 합시다.**

#### Swagger Deco

- **ApiBearerAuth()** : 스웨거에서 `토큰정보 | key`를 받기 위한 데코레이터 위 코드에선 aceess토큰과 refresh토큰을 받기 위해 사용 되었다.
- **ApiOperation()** : 스웨거에서 해당 앤드포인트 정보를 정의하기 위한 데코레이터
- **ApiTags()** : 스웨거에서 컨트롤단위의 앤드포인트 정보를 정의하기 위한 데코레이터

#### Common Deco

- **Controller()** : 컨트롤러 객체를 정의하기 위해 사용하는 데코
- **Get()** : get타입 요청을 받기 위한 데코
- **Post()** : post타입 요청을 받기 위한 데코
- **Body()** : post타입 요청에서 body에 해당하는 데이터를 받기 위한 데코
- **Patch()** : patch형의 업데이트를 수행하는 메서드를 정의하는 데코 <span style="font-size:12px">put()도 있겠죠?</span>
- **Param()** : get타입 요청에서 param데이터를 받기 위한 데코
- **Delete()** : delete형의 삭제를 수행하는 메서드를 정의하는 데코
- **Query()** : get타입 요청에서 query데이터를 받기 위한 데코
- **Res()** : 해당 앤드포인트에서 사용 될 response 객체를 받기 위한 데코
- **Req()** : 해당 앤드포인트에서 사용하는 request 객체를 받기 위한 데코

#### Custom Deco

`@ApiGuard`의 경우 재사용성을 높이기 위해 커스텀으로 만든 데코레이터입니다. </br>
인증이 필요한 경우 데코레이터를 선언해주고 허용 할 Role을 설정해주면 됩니다. <span style="font-size:12px">ex: `ApiGuard({summary:"테스트용"},["Admin"])`</span>

```ts
export const ApiGuard = (
  option?: ApiOperationOptions,
  roles?: AllowAuthRole[] | string[],
) => {
  if (!roles)
    return applyDecorators(
      ApiOperation(option),
      UseGuards(AuthGuard),
      Public(),
      ApiBearerAuth(AccessToken),
      ApiBearerAuth(RefreshToken),
    );
  return applyDecorators(
    ApiOperation({ ...option, description: 'Auth Role : ' + roles.toString() }),
    UseGuards(AuthGuard),
    Roles(...roles),
    ApiBearerAuth(AccessToken),
    ApiBearerAuth(RefreshToken),
  );
};
```

- 인가 역할을 설정하지 않으면 public으로 간주합니다.
</br>
> 해당 기술에 대해 자세히 알고 싶다면 다음 링크를 참고하세요. </br> > [Official](https://docs.nestjs.com/custom-decorators) </br> > [Wooklogy](https://velog.io/@artlogy/10.-Guard-Auth#swagger-auth)

---

### :safety_pin: Service

서비스단은 요청에 대한 응답을 위한 기술적인 내용이 들어가는 부분입니다. </br>
백앤드개발자의 실질적인 테크닉이 들어갑니다.

**app/account/account.service.ts**

```ts
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
```

#### 트렌젝션

데이터의 무결성을 위해 추가/삭제/수정등의 데이터가 변경되는 기능은 트렌젝션을 걸어주셔야 합니다.</br>
트렌젝션을 거는 가장 간단한 방법은 다음과 같습니다.

```ts
//여기서 manager는 EntityManager를 뜻합니다.
const result = await this.datasource.transaction(async (manager) => {
  //do someting
});
```

`do someting`주석이 있는 곳에서 기능을 작성하면</br>
기능이 구동 될 때 에러가 생기면 모든 진행을 취소하기 때문에 데이터의 무결성과 신뢰성을 지킬 수 있게 됩니다.

#### ResponseDTO로 매핑하기

회원가입 후 가입된 유저의 데이터를 그대로 응답으로 보내면 안됩니다. </br>
비밀번호나 리플래시토큰 전화번호등 민감한 정보를 포함하고 있기 때문입니다. </br>
딱히 민감한 정보를 포함하지 않는 모델이라도 필요없는 데이터는 빼서 전달하여야 합니다. </br>
때문에 모델 객체를 우리가 정의한 ResponseDto객체로 매핑해야하며 방법은 다음과 같습니다. </br>

```ts
const resBody: ResponseAccountDto = plainToInstance(
  ResponseAccountDto,
  reponseModel,
);
// 모델이 배열일 경우
const resBody: ResponseAccountDto[] = plainToInstance(
  ResponseAccountDto,
  reponseModel,
);
```

### :briefcase: Module

기능을 만들었으면 실제 환경에서 사용이 가능하게 등록을 해주어야합니다. </br>
모듈은 우리가 만든 기능들을 앱에 등록하기 위한 역할을 담당합니다. </br>

```ts
import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { Account } from './entities/account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  //typeorm에 내가 만든 모델 등록
  imports: [TypeOrmModule.forFeature([Account])],
  // controller 등록
  controllers: [AccountController],
  // service 등록
  providers: [AccountService],
})
export class AccountModule {}

// 실제 DATABASE에 등록하기 위한 객체
export const AccountEntities = [Account];
```

기본 형태는 위와 같습니다. </br>
위 처럼 모듈을 등록했다면 다음과 같이 app모듈과 db에 등록해주면 실제 환경에 적용이 완료 됩니다.
**app.module.ts**

```ts
import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { FileModule } from './file/file.module';
import { CustomConfigModule } from './config.module';

@Module({
  //모듈은 이곳에 등록해준다.
  imports: [CustomConfigModule, AccountModule, FileModule],
})
export class AppModule {}
```

> `nest g res {name}`MVC모델을 매크로 명령어로 만들었다면 자동으로 등록되어 있을 것입니다.
> **database.config.ts**

```ts
import { AccountEntities } from '@app/account/account.module';
import { FileEntities } from '@app/file/file.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const dataBaseConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'mariadb',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
    // ADD ENTITIES
    entities: [...AccountEntities, ...FileEntities], //앤티티 모델은 이곳에 등록해주어야 실제 데이터베이스에 반영이 된다.
  }),
  inject: [ConfigService],
};
```

---

# :open_file_folder: File 코드 설명

### File

### 구현된 기능

- **파일 업로드**
- **파일 검색**
- **파일 다운로드**

---

### :gear: File Config

샘플 코드는 로컬저장을 기준으로 구현되었습니다.</br>
**config/file.config.ts**

```ts
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
```

#### 저장 위치를 바꾸고 싶다면?

```ts
export const LOCAL_ATTACH_SAVE_PATH: string = path.join(
  __dirname,
  '../../',
  'public',
);
```

위 코드를 수정하면 됩니다.

#### 저장되는 파일의 이름 형식을 바꾸고 싶다면?

```ts
    filename(req, file, callback) {
      file['uuid'] = randomUUID();
      callback(null, `${file['uuid']}${path.extname(file.originalname)}`);
    },
```

위 코드에서 callback의 두번째 파라미터를 수정하시면 됩니다.

---

### :outbox_tray: File Upload

**app/file/file.controller.ts**

```ts
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
```

파일 업로드를 위해선 `CustomFileUpload`데코레이터와 `UploadFile()`데코레이터가 필수적입니다.

> `CustomeFileUpload()`는 커스텀 데코레이터로 config에 정의되어 있습니다.

파일을 업로드하면 정적파일로써 파일을 볼 수 있습니다.</br>

<p align="center">
<img src="https://user-images.githubusercontent.com/117614036/204237760-18f03d82-4d0a-4b04-a236-32d83f36151c.png" alt="static file"/>
</p>

정적파일의 경로는 다음과 같은 패턴을 따릅니다.</br>
`{root_path}/public/{file_uuid}.{file_extendsion}` </br>

---

### :inbox_tray: File Download

```ts
  async downloadFile(res: Response, uuid: string): Promise<ResponseFileDto> {
    const model: File = await this.fileRepo.findOne({ where: { uuid: uuid } });
    const responseModel = plainToInstance(ResponseFileDto, model);
    res.download(
      `${LOCAL_ATTACH_SAVE_PATH}/${responseModel.uuid}.${responseModel.extension}`,
    );
    return responseModel;
  }
```

파일 다운로드를 위해선 Response객체에 정의된 donwload메서드를 사용하여</br>
파일이 저장되어 있는 경로를 정확히 기입해주면 됩니다.

> NestJS에서 파일에 대한 자세한 내용은 다음 링크를 이용해주세요.</br> > [Official File](https://docs.nestjs.com/techniques/file-upload) </br> > [Wooklogy File](https://velog.io/@artlogy/File)
