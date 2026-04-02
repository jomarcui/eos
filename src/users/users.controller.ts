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
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // -------------------------------
  // Create a new user
  // -------------------------------
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return await this.usersService.create(dto);
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

  @Get('roles')
  getRoles(): string[] {
    return this.usersService.getRoles();
  }

  @Get('count')
  async getCount(): Promise<{ count: number }> {
    const count = await this.usersService.count();
    return { count };
  }
}
