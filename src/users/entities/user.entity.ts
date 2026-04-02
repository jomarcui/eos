import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { UserRole } from '../enums/user-role.enums';
import { UserStatus } from '../enums/user-status.enums';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash', select: false })
  passwordHash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: UserRole.ADMIN })
  role: string;

  @Column({ default: UserStatus.ACTIVE })
  status: string;

  @Column({ name: 'created_by_id', nullable: true })
  createdById?: string;

  @Column({ name: 'updated_by_id', nullable: true })
  updatedById?: string;
}
