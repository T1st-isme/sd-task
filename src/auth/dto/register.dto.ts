import { IsNotEmpty, IsString, IsEmail, MinLength, ValidateIf } from "class-validator";

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.password === o.confirmPassword)
  confirmPassword: string;

}
