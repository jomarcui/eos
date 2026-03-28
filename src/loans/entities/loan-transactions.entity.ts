import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Loan } from './loan.entity';

@Entity({ name: 'loan_transactions' })
export class LoanTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'loan_id' })
  loanId: string;

  @ManyToOne(() => Loan, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'loan_id' })
  loan: Loan;

  @Column()
  type: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column({ name: 'reference_number', nullable: true })
  referenceNumber: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
