import { PrismaService } from './prisma.service';
import { getTestModule } from '../jest/shared-test.module';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module = await getTestModule();
    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
