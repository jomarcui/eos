import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';
import { Loan } from './entities/loan.entity';
import { LoanSchedule } from './entities/loan-schedule.entity';
import { LoanTransaction } from './entities/loan-transactions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loan, LoanSchedule, LoanTransaction])],
  controllers: [LoansController],
  providers: [LoansService],
})
export class LoansModule {}
