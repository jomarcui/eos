import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Borrower } from './entities/borrower.entity';
import { CreateBorrowerDto } from './dto/create-borrower.dto';
import { UpdateBorrowerDto } from './dto/update-borrower.dto';

@Injectable()
export class BorrowersService {
  constructor(
    @InjectRepository(Borrower)
    private readonly borrowerRepository: Repository<Borrower>,
  ) {}

  async create(createBorrowerDto: CreateBorrowerDto) {
    const borrower = this.borrowerRepository.create(createBorrowerDto);
    return this.borrowerRepository.save(borrower);
  }

  async findAll(page: number, limit: number, search?: string) {
    const query = this.borrowerRepository.createQueryBuilder('borrower');

    if (search) {
      query.where(
        'borrower.firstName ILIKE :search OR borrower.lastName ILIKE :search OR borrower.email ILIKE :search OR borrower.phone ILIKE :search',
        { search: `%${search}%` },
      );
    }

    query
      .orderBy('borrower.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    const borrower = await this.borrowerRepository
      .createQueryBuilder('borrower')
      .leftJoinAndSelect('borrower.loans', 'loan')
      .where('borrower.id = :id', { id })
      .getOne();

    if (!borrower) {
      throw new NotFoundException('Borrower not found');
    }

    return borrower;
  }

  async update(id: string, updateBorrowerDto: UpdateBorrowerDto) {
    const borrower = await this.findOne(id);

    Object.assign(borrower, updateBorrowerDto);

    return this.borrowerRepository.save(borrower);
  }

  async remove(id: string) {
    const borrower = await this.findOne(id);

    borrower.isActive = false;
    borrower.deletedAt = new Date();

    return this.borrowerRepository.save(borrower);
  }

  async restore(id: string) {
    const borrower = await this.findOne(id);

    borrower.isActive = true;

    return this.borrowerRepository.save(borrower);
  }
}
