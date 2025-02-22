import { UserService } from './user.service';
import { getTestModule } from '../jest/shared-test.module';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module = await getTestModule();
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user = await service.makeUser("Bob Dobbs", "bob@example.net");
    expect(user.id).toBeDefined();
  });
});
