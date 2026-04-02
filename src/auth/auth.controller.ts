import type { Response } from 'express';
import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import type { RequestUser } from 'src/common/interfaces/request-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('me')
  getMe(@CurrentUser() user: RequestUser): RequestUser {
    return user;
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const token = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    res.cookie('token', token, {
      httpOnly: true, // prevents JS access
      secure: true, // only over HTTPS
      sameSite: 'strict', // CSRF protection
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return res.send({ message: 'Login successful' });
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'Logged out' });
  }
}
