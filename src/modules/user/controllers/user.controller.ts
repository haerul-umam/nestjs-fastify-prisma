import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GetUsersService } from '../services/get-users.service';
import { GetUserService } from '../services/get-user.service';
import { CreateUserService } from '../services/create-user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import ResponseMessage from '@application/api/http-rest/decorator/message.response.decorator';

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
}
