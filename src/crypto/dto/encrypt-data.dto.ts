import { ApiProperty as ApiPropertyEncrypt } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class EncryptDataDto {
  @ApiPropertyEncrypt({
    description: 'The payload string to be encrypted',
    maxLength: 2000,
    example: 'My Payload',
  })
  @IsString()
  @MaxLength(2000)
  payload: string;
}