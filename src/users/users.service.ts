import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './enums/user-roles.enums';
import { UserStatus } from './enums/user-status.enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto, creatorId?: string) {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      email: dto.email,
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      createdById: creatorId,
    });

    return this.userRepository.save(user);
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;
    return user;
  }

  findByEmail(email: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }

  async update(id: string, dto: UpdateUserDto, updaterId?: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // email update
    if (dto.email) {
      user.email = dto.email;
    }

    // password update
    if (dto.password) {
      user.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    // ⚠️ optionally restrict these
    if (dto.role) {
      user.role = dto.role;
    }

    if (dto.status) {
      user.status = dto.status;
    }

    user.updatedById = updaterId;

    return this.userRepository.save(user);
  }
}
