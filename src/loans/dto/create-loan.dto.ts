import { IsUUID, IsNumber, IsDateString } from 'class-validator';

export class CreateLoanDto {
  @IsUUID()
  borrowerId: string;

  @IsNumber()
  principal: number;

  @IsNumber()
  interestRate: number;

  @IsNumber()
  termMonths: number;

  @IsDateString()
  startDate: Date;
}
