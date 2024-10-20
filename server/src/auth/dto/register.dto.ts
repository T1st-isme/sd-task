import { IsNotEmpty, IsString, IsEmail, MinLength, ValidateIf } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'john_doe', description: 'The username of the user' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'The email of the user' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123', description: 'The password of the user' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'strongPassword123', description: 'The confirm password of the user' })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.password === o.confirmPassword)
  confirmPassword: string;

}
