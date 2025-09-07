import { Test as TestController, TestingModule as TestingModuleController } from '@nestjs/testing';
import { CryptoController } from './crypto.controller';
import { CryptoService } from './crypto.service';

// Mock CryptoService
const mockCryptoService = {
  encrypt: jest.fn().mockReturnValue({
    data1: 'encrypted-key',
    data2: 'encrypted-payload',
  }),
  decrypt: jest.fn().mockReturnValue({
    payload: 'decrypted-payload',
  }),
};

describe('CryptoController', () => {
  let controller: CryptoController;

  beforeEach(async () => {
    const module: TestingModuleController = await TestController.createTestingModule({
      controllers: [CryptoController],
      providers: [
        {
          provide: CryptoService,
          useValue: mockCryptoService,
        },
      ],
    }).compile();
    controller = module.get<CryptoController>(CryptoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});