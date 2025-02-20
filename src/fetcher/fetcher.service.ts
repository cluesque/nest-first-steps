import { Injectable } from '@nestjs/common';

@Injectable()
export class FetcherService {
  async getNarf(arg: String) {
    return 'narf';
  }

  async getCat(cat: String) : Promise<Response> {
    // let url = 'https://http.cat/201';
    let url = 'https://http.cat/' + cat;
    let response = await fetch(url);
    return response;
  }
}
