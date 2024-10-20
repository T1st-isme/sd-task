import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john_doe', description: 'The identifier of the user' })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ example: 'strongPassword123', description: 'The password of the user' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({ example: '123456', description: 'The two factor code of the user' })
  @IsOptional()
  @IsString()
  twoFactorCode?: string;
}
