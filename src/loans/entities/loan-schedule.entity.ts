import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Loan } from './loan.entity';

@Entity({ name: 'loan_schedules' })
export class LoanSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'loan_id' })
  loanId: string;

  @ManyToOne(() => Loan, (loan) => loan.schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'loan_id' })
  loan: Loan;

  @Column()
  installment: number;

  @Column('decimal', { precision: 12, scale: 2 })
  principal: number;

  @Column('decimal', { precision: 12, scale: 2 })
  interest: number;

  @Column('decimal', { precision: 12, scale: 2 })
  payment: number;

  @Column('decimal', { precision: 12, scale: 2 })
  balance: number;

  @Column({ name: 'due_date', type: 'date' })
  dueDate: Date;

  @Column({ default: false })
  paid: boolean;
}
