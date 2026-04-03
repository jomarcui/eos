import { BaseEntity } from '@common/entities/base.entity';
import { Loan } from '../../loans/entities/loan.entity';
import {
  Entity,
  Column,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  Index,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ schema: 'loan', name: 'borrowers' })
export class Borrower extends BaseEntity {
  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName!: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName!: string;

  @Index()
  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 20 })
  phone!: string;

  @Column({ type: 'text' })
  address!: string;

  @OneToMany(() => Loan, (loan) => loan.borrower)
  loans!: Loan[];

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date | null;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail() {
    if (this.email) {
      this.email = this.email.trim().toLowerCase();
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  normalizePhone() {
    if (this.phone) {
      this.phone = this.phone.replace(/\s+/g, '');
    }
  }
}
