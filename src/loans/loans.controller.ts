import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Controller('borrowers/:borrowerId/loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  async create(
    @Param('borrowerId') borrowerId: string,
    @Body() body: CreateLoanDto,
  ) {
    const dto: CreateLoanDto = {
      borrowerId,
      principal: body.principal,
      termMonths: body.termMonths,
      interestRate: body.interestRate,
      startDate: body.startDate || new Date(), // default to today if not provided
    };

    return this.loansService.create(dto);
  }

  @Get()
  findAll() {
    return this.loansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loansService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLoanDto) {
    return this.loansService.update(id, dto);
  }

  @Post(':id/disburse')
  disburse(@Param('id') id: string) {
    return this.loansService.disburse(id);
  }
}
