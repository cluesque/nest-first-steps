import { Test, TestingModule } from '@nestjs/testing';
import { FetcherService } from './fetcher.service';
import fetchMock from "jest-fetch-mock";

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
    let response = await service.getCat('nope');
    let body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toBe('');  
  });

  it('allows disabling the mock', async () => {
    fetchMock.disableMocks();

    let response = await service.getCat('nope');
    let body = await response.text();

    // This is not a real page, so should 404, with some html or something
    expect(response.status).toBe(404);
    expect(body.length).toBeGreaterThan(10);
  });
});
