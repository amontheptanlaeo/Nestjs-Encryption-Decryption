import { Controller, Post, Body } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { EncryptDataDto as EncryptDto } from './dto/encrypt-data.dto';
import { DecryptDataDto as DecryptDto } from './dto/decrypt-data.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('Crypto')
@Controller()
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) { }

  @Post('get-encrypt-data')
  @ApiOperation({ summary: 'Encryption a payload' })
  @ApiResponse({ status: 201, description: 'Successfully encrypted the payload.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  getEncryptData(@Body() encryptDataDto: EncryptDto) {
    try {
      const encryptedData = this.cryptoService.encrypt(encryptDataDto.payload);
      return {
        successful: true,
        error_code: '',
        data: encryptedData,
      };
    } catch (error) {
      return {
        successful: false,
        error_code: 'ENCRYPTION_FAILED',
        data: null,
      };
    }
  }

  @Post('get-decrypt-data')
  @ApiOperation({ summary: 'Decryption a payload' })
  @ApiResponse({ status: 201, description: 'Successfully decrypted the payload.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  getDecryptData(@Body() decryptDataDto: DecryptDto) {
    try {
      const decryptedData = this.cryptoService.decrypt(
        decryptDataDto.data1,
        decryptDataDto.data2,
      );
      return {
        successful: true,
        error_code: '',
        data: decryptedData,
      };
    } catch (error) {
      return {
        successful: false,
        error_code: 'DECRYPTION_FAILED',
        data: null,
      };
    }
  }
}
