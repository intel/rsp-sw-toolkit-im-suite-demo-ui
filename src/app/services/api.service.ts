import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable()
export class ApiService {

  constructor(private client: HttpClient) { }

  getCommands(url: string){
    return this.client.get(url);
  }
}
