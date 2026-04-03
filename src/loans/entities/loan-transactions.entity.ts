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
import { TransactionType } from '../enums/transaction-type.enum';

@Entity({ name: 'loan_transactions' })
export class LoanTransaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'loan_id' })
  loanId!: string;

  @ManyToOne(() => Loan, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'loan_id' })
  loan!: Loan;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type!: string;

  // ✅ Use string for decimal (important!)
  @Column('decimal', { precision: 12, scale: 2 })
  amount!: string;

  @Column({
    name: 'reference_number',
    type: 'varchar',
    nullable: true,
  })
  referenceNumber!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
