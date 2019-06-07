import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable()
export class WebsocketService {

  private socket$: WebSocketSubject<any>;

  constructor() {
    this.socket$ = new WebSocketSubject('ws://localhost:8082');
  }

  getDataSub(): Observable<any> {
    this.socket$
    return this.socket$
  }
}