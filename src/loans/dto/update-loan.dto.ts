import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { LoanStatus } from '../enums/loan-status.enum';

export class UpdateLoanDto {
  @IsOptional()
  @IsEnum(LoanStatus)
  status?: LoanStatus;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  maturityDate?: Date;
}
