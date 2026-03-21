import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.usersRepo.create(createUserDto);
    console.log('Creating user:', user);
    throw new Error('Method not implemented.');
  }
  findAll() {
    throw new Error('Method not implemented.');
  }
  findOne(arg0: number) {
    console.log('Creating user:', arg0);
    throw new Error('Method not implemented.');
  }
  update(arg0: number, updateUserDto: UpdateUserDto) {
    console.log('Updating user:', arg0, updateUserDto);
    throw new Error('Method not implemented.');
  }
  remove(arg0: number) {
    console.log('Removing user:', arg0);
    throw new Error('Method not implemented.');
  }

  async findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findById(id: string) {
    return this.usersRepo.findOne({ where: { id } });
  }
}
