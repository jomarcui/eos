import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSchemas001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS auth`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS loan`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS audit`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SCHEMA IF EXISTS audit CASCADE`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS loan CASCADE`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS auth CASCADE`);
  }
}
