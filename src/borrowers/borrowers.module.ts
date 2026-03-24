import { Module } from '@nestjs/common';
import { BorrowersService } from './borrowers.service';
import { BorrowersController } from './borrowers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrower } from './entities/borrower.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Borrower])],
  controllers: [BorrowersController],
  providers: [BorrowersService],
})
export class BorrowersModule {}
