import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';

let testModule: TestingModule;

export async function getTestModule() {
  if (!testModule) {
    testModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  }
  return testModule;
} 