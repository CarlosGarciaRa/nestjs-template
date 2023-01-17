import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private prisma: PrismaService) {}
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
}
