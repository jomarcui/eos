import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Loan } from './entities/loan.entity';
import { Borrower } from '../borrowers/entities/borrower.entity';
import { AmortizationSchedule } from './entities/amortization-schedule.entity';

import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { AmortizationItem } from './types/amortization-item.type';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,

    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,

    @InjectRepository(AmortizationSchedule)
    private scheduleRepository: Repository<AmortizationSchedule>,
  ) {}

  async create(createLoanDto: CreateLoanDto) {
    const { borrowerId, principal, interestRate, termMonths, startDate } =
      createLoanDto;

    const borrower = await this.borrowerRepository.findOne({
      where: { id: borrowerId },
    });

    if (!borrower) {
      throw new NotFoundException('Borrower not found');
    }

    const loan = this.loanRepository.create({
      borrower,
      principal,
      interestRate,
      termMonths,
      startDate,
      balance: principal,
    });

    await this.loanRepository.save(loan);

    const schedule = this.generateSchedule(
      principal,
      interestRate,
      termMonths,
      startDate,
    );

    await this.scheduleRepository.save(
      schedule.map((item) => ({
        ...item,
        loan,
      })),
    );

    return loan;
  }

  findAll() {
    return this.loanRepository.find({
      relations: ['borrower'],
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: string) {
    return this.loanRepository.findOne({
      where: { id },
      relations: ['borrower', 'schedule'],
    });
  }

  update(id: string, updateLoanDto: UpdateLoanDto) {
    return this.loanRepository.update(id, updateLoanDto);
  }

  remove(id: string) {
    return this.loanRepository.delete(id);
  }

  generateSchedule(
    principal: number,
    annualInterest: number,
    months: number,
    startDate: Date,
  ): AmortizationItem[] {
    const monthlyRate = annualInterest / 100 / 12;

    const payment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
      (Math.pow(1 + monthlyRate, months) - 1);

    let balance = principal;

    const schedule: AmortizationItem[] = [];

    for (let i = 1; i <= months; i++) {
      const interest = balance * monthlyRate;
      const principalPayment = payment - interest;

      balance -= principalPayment;

      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      schedule.push({
        installmentNumber: i,
        dueDate,
        principalDue: principalPayment,
        interestDue: interest,
        totalDue: payment,
      });
    }

    return schedule;
  }
}
