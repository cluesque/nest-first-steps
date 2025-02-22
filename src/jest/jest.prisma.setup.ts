import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AppModule } from '../app.module';
import { getTestModule } from './shared-test.module';

let prismaService: PrismaService;

beforeAll(async () => {
  const moduleFixture = await getTestModule();
  prismaService = moduleFixture.get<PrismaService>(PrismaService);
});

beforeEach(async () => {
  await prismaService.$executeRaw`BEGIN`;
});

afterEach(async () => {
  await prismaService.$executeRaw`ROLLBACK`;
});