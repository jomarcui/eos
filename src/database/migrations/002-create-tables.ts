import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // USERS
    await queryRunner.query(`
      CREATE TABLE auth.users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        role VARCHAR(50) DEFAULT 'staff',
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      )
    `);

    // BORROWERS
    await queryRunner.query(`
      CREATE TABLE loan.borrowers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        phone VARCHAR(20),
        email VARCHAR(255),
        address TEXT,
        created_by UUID,
        created_at TIMESTAMP DEFAULT now(),

        CONSTRAINT fk_borrower_user
        FOREIGN KEY (created_by)
        REFERENCES auth.users(id)
      )
    `);

    // LOANS
    await queryRunner.query(`
      CREATE TABLE loan.loans (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        borrower_id UUID NOT NULL,
        principal NUMERIC(12,2) NOT NULL,
        interest_rate NUMERIC(5,2) NOT NULL,
        term_months INT NOT NULL,
        start_date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        created_by UUID,
        created_at TIMESTAMP DEFAULT now(),

        CONSTRAINT fk_loan_borrower
        FOREIGN KEY (borrower_id)
        REFERENCES loan.borrowers(id),

        CONSTRAINT fk_loan_user
        FOREIGN KEY (created_by)
        REFERENCES auth.users(id)
      )
    `);

    // AMORTIZATION SCHEDULE
    await queryRunner.query(`
      CREATE TABLE loan.amortization_schedule (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        loan_id UUID NOT NULL,
        installment_number INT,
        due_date DATE,
        principal_amount NUMERIC(12,2),
        interest_amount NUMERIC(12,2),
        total_amount NUMERIC(12,2),
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT now(),

        CONSTRAINT fk_amortization_loan
        FOREIGN KEY (loan_id)
        REFERENCES loan.loans(id)
        ON DELETE CASCADE
      )
    `);

    // PAYMENTS
    await queryRunner.query(`
      CREATE TABLE loan.payments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        loan_id UUID,
        schedule_id UUID,
        amount NUMERIC(12,2),
        payment_date TIMESTAMP,
        payment_method VARCHAR(50),
        reference_number VARCHAR(255),
        created_by UUID,
        created_at TIMESTAMP DEFAULT now(),

        CONSTRAINT fk_payment_loan
        FOREIGN KEY (loan_id)
        REFERENCES loan.loans(id),

        CONSTRAINT fk_payment_schedule
        FOREIGN KEY (schedule_id)
        REFERENCES loan.amortization_schedule(id),

        CONSTRAINT fk_payment_user
        FOREIGN KEY (created_by)
        REFERENCES auth.users(id)
      )
    `);

    // ACTIVITY LOGS
    await queryRunner.query(`
      CREATE TABLE audit.activity_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID,
        action VARCHAR(100),
        entity VARCHAR(100),
        entity_id UUID,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT now(),

        CONSTRAINT fk_activity_user
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE audit.activity_logs`);
    await queryRunner.query(`DROP TABLE loan.payments`);
    await queryRunner.query(`DROP TABLE loan.amortization_schedule`);
    await queryRunner.query(`DROP TABLE loan.loans`);
    await queryRunner.query(`DROP TABLE loan.borrowers`);
    await queryRunner.query(`DROP TABLE auth.users`);
  }
}
