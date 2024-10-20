import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'The new password for the user' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword: string;
}
