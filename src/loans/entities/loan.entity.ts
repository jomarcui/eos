import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Borrower } from '../../borrowers/entities/borrower.entity';
import { LoanStatus } from '../enums/loan-status.enum';

@Entity({ name: 'loans' })
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Borrower, (borrower) => borrower.loans, {
    onDelete: 'RESTRICT',
  })
  borrower: Borrower;

  @Column('decimal', { precision: 12, scale: 2 })
  principal: number;

  @Column('decimal', { precision: 5, scale: 2 })
  interestRate: number;

  @Column()
  termMonths: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  maturityDate: Date;

  @Column({
    type: 'enum',
    enum: LoanStatus,
    default: LoanStatus.PENDING,
  })
  status: LoanStatus;

  @Column('decimal', { precision: 12, scale: 2 })
  balance: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
