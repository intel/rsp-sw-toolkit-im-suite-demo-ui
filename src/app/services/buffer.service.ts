import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

const websocketURL = 'ws://localhost:8081';
const connectCommand = 'http://localhost:8081/connect';
const endpoint = 'http://localhost:48082/api/v1/device/name/device-ble';

@Injectable()
export class BufferService {
  public messages: Subject<any>;
  constructor(wsService: WebsocketService, public httpClient: HttpClient) {
    const x = wsService.connect(websocketURL);
    this.messages = x.pipe(
      map((response: MessageEvent): any => {
        const data = JSON.parse(response.data);
        return data;
      })
    ) as Subject<any>;

  }
  connectToDevice(uuid: string) {
    const x = this.httpClient.get(endpoint).pipe(
      map(this.extractData),
      catchError((x, obs): any => {
        console.error(x);
        return [];
      })
    ).subscribe(val => {
      this.executeCommand(val[0], uuid);
    });
  }
  extractData(data: any) {
    return [data.commands[0].put.url];
  }
  executeCommand(url: string, uuid: string) {
    const x = this.httpClient.post(connectCommand, { uuid, url }).pipe(
      catchError((x, obs): any => {
        console.error(x);
        return [];
      })
    ).subscribe(val => {
      console.log(val);
    });
  }
}
