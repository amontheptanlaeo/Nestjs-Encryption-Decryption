import { ApiProperty as ApiPropertyDecrypt } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class DecryptDataDto {
  @ApiPropertyDecrypt({
    description: 'Encrypted AES Key With PrivateKey',
    example: 'base64-encoded',
  })
  @IsString()
  @IsNotEmpty()
  data1: string;

  @ApiPropertyDecrypt({
    description: 'Encrypted Payload (AES Key)',
    example: 'base64-encoded',
  })
  @IsString()
  @IsNotEmpty()
  data2: string;
}