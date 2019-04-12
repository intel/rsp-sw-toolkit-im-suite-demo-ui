import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { WebsocketService } from "./websocket.service";
import { map } from 'rxjs/operators';

const CHAT_URL = "ws://localhost:8081";


@Injectable()
export class BufferService {
  public messages: Subject<any>;

  constructor(wsService: WebsocketService) {
    let x = wsService.connect(CHAT_URL)
    this.messages = <Subject<any>>x.pipe(
      map((response: MessageEvent): any => {
        let data = JSON.parse(response.data);
        return data;
      })
    )

  }
}