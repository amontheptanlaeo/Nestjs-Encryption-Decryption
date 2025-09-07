import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService as TestingCryptoService } from '../crypto/crypto.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 1024,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

// Mocktp ConfigService
const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'PUBLIC_KEY') return publicKey
    if (key === 'PRIVATE_KEY') return privateKey
    return null;
  }),
};

describe('CryptoService', () => {
  let service: TestingCryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestingCryptoService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<TestingCryptoService>(TestingCryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('encrypt and decrypt roundtrip', () => {
    it('should return the original payload after encrypting and decrypting', () => {
      const originalPayload = 'secret message';
      const { data1, data2 } = service.encrypt(originalPayload);
      const { payload: decryptedPayload } = service.decrypt(data1, data2);
      expect(decryptedPayload).toBe(originalPayload);
    });
  });
});
