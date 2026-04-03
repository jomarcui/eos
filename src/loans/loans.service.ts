import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Loan } from './entities/loan.entity';
import { LoanSchedule } from './entities/loan-schedule.entity';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { LoanStatus } from './enums/loan-status.enum';
import { LoanTransaction } from './entities/loan-transactions.entity';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,

    @InjectRepository(LoanSchedule)
    private scheduleRepository: Repository<LoanSchedule>,

    @InjectRepository(LoanTransaction)
    private transactionRepository: Repository<LoanTransaction>,
  ) {}

  async create(dto: CreateLoanDto) {
    const monthlyRate = dto.interestRate / 100 / 12;

    const monthlyPaymentRaw =
      (dto.principal * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -dto.termMonths));

    const monthlyPayment = Number(monthlyPaymentRaw.toFixed(2));

    const maturityDate = new Date(dto.startDate);
    maturityDate.setMonth(maturityDate.getMonth() + dto.termMonths);

    const loanNumber = await this.generateLoanNumber();

    const loan = this.loanRepository.create({
      loanNumber,
      borrowerId: dto.borrowerId,
      principal: dto.principal.toFixed(2),
      interestRate: dto.interestRate.toFixed(2),
      termMonths: dto.termMonths,
      monthlyPayment: monthlyPayment.toFixed(2),
      balance: dto.principal.toFixed(2),
      startDate: dto.startDate,
      maturityDate,
    });

    await this.loanRepository.save(loan);

    const schedules = this.generateSchedule(
      loan.id,
      dto.startDate,
      dto.principal,
      monthlyRate,
      dto.termMonths,
      monthlyPayment,
    );

    await this.scheduleRepository.save(schedules);

    return loan;
  }

  async generateLoanNumber(): Promise<string> {
    const count = await this.loanRepository.count();
    const year = new Date().getFullYear();

    return `LN-${year}-${String(count + 1).padStart(6, '0')}`;
  }

  generateSchedule(
    loanId: string,
    startDate: Date,
    principal: number,
    monthlyRate: number,
    term: number,
    payment: number,
  ) {
    const schedules: Partial<LoanSchedule>[] = [];
    let balance = principal;

    for (let i = 1; i <= term; i++) {
      const interest = balance * monthlyRate;
      const principalPayment = payment - interest;

      balance -= principalPayment;

      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      schedules.push({
        loanId,
        installment: i,
        principal: principalPayment,
        interest,
        payment,
        balance: balance < 0 ? 0 : balance,
        dueDate,
      });
    }

    return schedules;
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
      relations: ['borrower', 'schedules'],
    });
  }

  async update(id: string, dto: UpdateLoanDto) {
    const loan = await this.loanRepository.findOne({
      where: { id },
    });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    // 🚨 Business rule: active loans cannot be modified
    if (
      loan.status === LoanStatus.ACTIVE ||
      loan.status === LoanStatus.DISBURSED
    ) {
      throw new BadRequestException('Active loans cannot be modified');
    }

    Object.assign(loan, dto);

    return this.loanRepository.save(loan);
  }

  async disburse(id: string) {
    const loan = await this.loanRepository.findOne({
      where: { id },
    });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    if (loan.status !== LoanStatus.APPROVED) {
      throw new BadRequestException('Only approved loans can be disbursed');
    }

    loan.status = LoanStatus.DISBURSED;
    loan.disbursedAt = new Date();

    await this.loanRepository.save(loan);

    const transaction = this.transactionRepository.create({
      loanId: loan.id,
      type: 'DISBURSEMENT',
      amount: loan.principal,
    });

    await this.transactionRepository.save(transaction);

    return loan;
  }
}
