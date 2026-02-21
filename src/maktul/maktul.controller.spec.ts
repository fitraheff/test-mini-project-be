import { Test, TestingModule } from '@nestjs/testing';
import { MaktulController } from './maktul.controller';
import { MaktulService } from './maktul.service';

describe('MaktulController', () => {
  let controller: MaktulController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaktulController],
      providers: [MaktulService],
    }).compile();

    controller = module.get<MaktulController>(MaktulController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
