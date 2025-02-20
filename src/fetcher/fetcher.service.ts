import { Injectable } from '@nestjs/common';

@Injectable()
export class FetcherService {
  async getNarf(arg: String) {
    return 'narf';
  }

  async getCat() {
    let url = 'https://http.cat/201';
    let response = await fetch(url);
    return response;
  }
}
