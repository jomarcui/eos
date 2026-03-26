import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrower } from 'src/borrowers/entities/borrower.entity';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { AmortizationSchedule } from './entities/amortization-schedule.entity';
import { Loan } from './entities/loan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loan, Borrower, AmortizationSchedule])],
  controllers: [LoansController],
  providers: [LoansService],
})
export class LoansModule {}
