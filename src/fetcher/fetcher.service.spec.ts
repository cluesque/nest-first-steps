import { Test, TestingModule } from '@nestjs/testing';
import { FetcherService } from './fetcher.service';

describe('FetcherService', () => {
  let service: FetcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FetcherService],
    }).compile();

    service = module.get<FetcherService>(FetcherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have a method', () => {
    expect(service.getNarf).toBeDefined();
  });

  it('should do a silly thing', async () => {
    const answer = await service.getNarf('unused');
    expect(answer).toBe('narf');
  });

  it('should have a fetching method', () => {
    expect(service.getCat).toBeDefined();
  });

  it('should fetch the cat', async () => {    
    let url = 'https://http.cat/201';
    let response = await service.getCat();
    expect(response.status).toBe(200);
  }
  );
});
