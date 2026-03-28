import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Loan } from './loan.entity';

@Entity('amortization_schedules')
export class AmortizationSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  loanId: string;

  @ManyToOne(() => Loan, (loan) => loan.schedules, {
    onDelete: 'CASCADE',
  })
  loan: Loan;

  @Column()
  installmentNumber: number;

  @Column('decimal')
  principal: number;

  @Column('decimal')
  interest: number;

  @Column('decimal')
  payment: number;

  @Column('decimal')
  balance: number;

  @Column()
  dueDate: Date;

  @Column({ default: false })
  paid: boolean;
}
