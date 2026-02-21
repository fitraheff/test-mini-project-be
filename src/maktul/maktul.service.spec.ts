import { Test, TestingModule } from '@nestjs/testing';
import { MaktulService } from './maktul.service';

describe('MaktulService', () => {
  let service: MaktulService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaktulService],
    }).compile();

    service = module.get<MaktulService>(MaktulService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
