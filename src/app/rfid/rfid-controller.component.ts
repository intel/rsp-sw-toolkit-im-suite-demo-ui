import { Component, OnInit } from '@angular/core';
import { BufferService } from '../services/buffer.service';
import { WebsocketService } from '../services/websocket.service';
import { Subscription, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';



interface posItem {
  product_id: string;
  product_name: string;
  quantity: number;
  quantity_unit: string;
  unit_price: number;
  reconciled: boolean;
}
interface scaleItem {
  scale_id: string;
  total: string;
  delta: string;
  event_time: string;
  units: string;
}
interface data {
  positems: Array<posItem>;
  scaleitem: scaleItem;
  suspectitems: Array<scaleItem>;
}

@Component({
  selector: 'app-rfid-controller',
  templateUrl: './rfid-controller.component.html',
  styleUrls: ['./rfid-controller.component.scss']
})
export class RFIDControllerComponent implements OnInit {

  commands: any[]
  controllerCommands: string[]
  commandResponse: any

  sub: Subscription;
  http: any;

  client: HttpClient;
  loading: boolean;
  loadingCommands: boolean;
  controllerCommandsResponseObservable : Observable <any[]>


  constructor(private apiService: ApiService) {
    this.controllerCommands = []
  }

  ngOnInit() {
    this.commands = this.apiService.getRfidControllerCommands()
    console.log(this.commands)
  }
  
  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }

  getCommandResponse(command: any){
    this.commandResponse = <any>{}
    this.loading = true;
    this.apiService.getCommandResponse(command)
    .subscribe(
      (message)=> {
        this.commandResponse = JSON.parse(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(message)).readings))[0].value);
        this.loading = false;
      }
    )
  }
}
