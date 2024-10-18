import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return {
        success: true,
        data: users
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    return {
        success: true,
        data: user
    };
  }


  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.userService.remove(id);
    return {
        success: true,
        data: user
    };
  }
}
