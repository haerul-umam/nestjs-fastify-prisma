import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { GetUsersService } from '../services/get-users.service';
import { GetUserService } from '../services/get-user.service';
import { CreateUserService } from '../services/create-user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import ResponseMessage from '@application/api/http-rest/decorator/message.response.decorator';
import { MultipartInterceptor } from '@shared/interceptors/multipart.interceptor';
import { Files } from '@shared/decorators/file.decorator';
import {
  DOCUMENTS_REGEX,
  IMAGES_REGEX,
} from '@shared/constants/file-type.constant';
import { saveUploadedFiles } from '@shared/helpers/file.helper';

@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly getUsersService: GetUsersService,
    private readonly createUserService: CreateUserService,
  ) {}

  @Post()
  @ResponseMessage('User created successfully')
  create(@Body() createUserDto: CreateUserDto) {
    return this.createUserService.execute(createUserDto);
  }

  @Get()
  findAll() {
    return this.getUsersService.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getUserService.execute(+id);
  }

  @Post('file')
  @UseInterceptors(
    MultipartInterceptor({
      documents: {
        maxFileSize: 5 * 1024 * 1024, // 5MB
        fileType: DOCUMENTS_REGEX,
      },
      avatar: {
        maxFileSize: 2 * 1024 * 1024, // 2MB
        fileType: IMAGES_REGEX,
      },
    }),
  )
  async upload(@Files() files: Record<string, Storage.MultipartFile[]>) {
    await Promise.all([
      saveUploadedFiles(files.documents, 'doc'),
      saveUploadedFiles(files.avatar),
    ]);
    // console.log('files', files);
    return {};
  }
}
