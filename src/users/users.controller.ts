import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  ParseUUIDPipe,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // -------------------------------
  // Create a new user
  // -------------------------------
  @Post()
  async create(@Body() dto: CreateUserDto) {
    // You can optionally pass creatorId if authenticated
    return this.usersService.create(dto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  // -------------------------------
  // Get user by ID
  // -------------------------------
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.findOne(id);
    return instanceToPlain(user);
  }

  // -------------------------------
  // Update user
  // -------------------------------
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    // You can optionally pass updaterId if authenticated
    return this.usersService.update(id, dto);
  }
}
