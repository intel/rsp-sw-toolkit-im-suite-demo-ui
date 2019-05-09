import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import * as socketIo from 'socket.io-client';
import { Socket } from '../shared/interfaces';

declare var io: {
  connect(url: string): Socket;
};

@Injectable()
export class WebsocketService {

  constructor() { }

  socket: Socket;
  observer: Observer<any>;

  getQuotes(): Observable<any> {
    this.socket = socketIo('http://localhost:8080');

    this.socket.on('data', (res) => {
      this.observer.next(res.data);
    });

    return this.createObservable();
  }

  createObservable(): Observable<any> {
    return new Observable<any>(observer => {

      this.observer = observer;
    });
  }

}