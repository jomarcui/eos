import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UserRole } from './enums/user-roles.enums';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onModuleInit() {
    const count = await this.userRepo.count();
    console.log({ count });
    if (process.env.NODE_ENV !== 'production') {
      if (count === 0) {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(
          'testuser1@example.com',
          saltRounds,
        );
        await this.userRepo.save([
          {
            email: 'testuser1@example.com',
            passwordHash: passwordHash,
            role: UserRole.ADMIN,
          },
        ]);

        console.log('Seed data inserted');
      }
    }
  }
}
