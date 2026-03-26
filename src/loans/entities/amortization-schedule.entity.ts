import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Loan } from './loan.entity';

@Entity({ name: 'amortization_schedule' })
export class AmortizationSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Loan, {
    onDelete: 'CASCADE',
  })
  loan: Loan;

  @Column()
  installmentNumber: number;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column('decimal', { precision: 12, scale: 2 })
  principalDue: number;

  @Column('decimal', { precision: 12, scale: 2 })
  interestDue: number;

  @Column('decimal', { precision: 12, scale: 2 })
  totalDue: number;

  @Column({ default: false })
  paid: boolean;
}
