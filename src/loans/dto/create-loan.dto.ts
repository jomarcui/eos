import { IsUUID, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateLoanDto {
  @IsUUID()
  borrowerId!: string;

  @IsNumber()
  @Min(1)
  principal!: number;

  @IsNumber()
  interestRate!: number;

  @IsNumber()
  termMonths!: number;

  @IsDateString()
  startDate!: Date;
}
