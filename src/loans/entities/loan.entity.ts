import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Borrower } from '../../borrowers/entities/borrower.entity';
import { LoanStatus } from '../enums/loan-status.enum';
import { LoanSchedule } from './loan-schedule.entity';

@Entity({ name: 'loans' })
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'loan_number', unique: true })
  loanNumber!: string;

  @Index()
  @Column({ name: 'borrower_id' })
  borrowerId!: string;

  @ManyToOne(() => Borrower, (borrower) => borrower.loans, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'borrower_id' })
  borrower!: Borrower;

  // ⚠️ Use string for decimal to avoid precision issues
  @Column('decimal', { precision: 12, scale: 2 })
  principal!: string;

  @Column('decimal', { name: 'interest_rate', precision: 5, scale: 2 })
  interestRate!: string;

  @Column({ name: 'term_months', type: 'integer' })
  termMonths!: number;

  @Column('decimal', { precision: 12, scale: 2 })
  monthlyPayment!: string;

  @Column('decimal', { precision: 12, scale: 2 })
  balance!: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate!: Date;

  @Column({ name: 'maturity_date', type: 'date' })
  maturityDate!: Date;

  @Index()
  @Column({
    type: 'enum',
    enum: LoanStatus,
    default: LoanStatus.PENDING,
  })
  status!: LoanStatus;

  @OneToMany(() => LoanSchedule, (schedule) => schedule.loan, {
    cascade: true,
  })
  schedules!: LoanSchedule[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'disbursed_at', type: 'timestamp', nullable: true })
  disbursedAt!: Date | null;
}
