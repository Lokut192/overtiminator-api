import { Test, TestingModule } from '@nestjs/testing';
import { GlobalUserSettingsController } from './global-user-settings.controller';

describe('GlobalUserSettingsController', () => {
  let controller: GlobalUserSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GlobalUserSettingsController],
    }).compile();

    controller = module.get<GlobalUserSettingsController>(GlobalUserSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
