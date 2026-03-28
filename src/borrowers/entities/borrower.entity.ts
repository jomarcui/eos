import { BaseEntity } from 'src/common/entities/base.entity';
import { Loan } from 'src/loans/entities/loan.entity';
import { Entity, Column, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity({ schema: 'loan', name: 'borrowers' })
export class Borrower extends BaseEntity {
  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ type: 'text' })
  address: string;

  @OneToMany(() => Loan, (loan) => loan.borrower)
  loans: Loan[];

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({
    name: 'deleted_at',
    nullable: true,
    type: 'timestamp',
  })
  deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail() {
    if (this.email) {
      this.email = this.email.trim().toLowerCase();
    }
  }
}
