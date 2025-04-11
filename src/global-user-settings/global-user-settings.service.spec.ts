import { Test, TestingModule } from '@nestjs/testing';
import { GlobalUserSettingsService } from './global-user-settings.service';

describe('GlobalUserSettingsService', () => {
  let service: GlobalUserSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlobalUserSettingsService],
    }).compile();

    service = module.get<GlobalUserSettingsService>(GlobalUserSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
