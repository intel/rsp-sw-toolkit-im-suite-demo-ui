import { Component, OnInit } from '@angular/core';
import { BufferService } from '../services/buffer.service';
import { WebsocketService } from '../services/websocket.service';
import { Subscription } from 'rxjs';
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
  selector: 'app-rfid-inventory',
  templateUrl: './rfid-inventory.component.html',
  styleUrls: ['./rfid-inventory.component.scss']
})
export class RFIDInventoryComponent implements OnInit {

  controllerCommands: string[]
  commandResponse: any
  suspectItems: scaleItem[]
  scaleReading: scaleItem
  scaleTotal: any;
  scaleUnit: any;

  sub: Subscription;
  http: any;

  client: HttpClient;
  loading: boolean;

  constructor(private apiService: ApiService) {
    this.controllerCommands = []
    this.suspectItems = []
    this.scaleReading = {} as scaleItem
  }

  ngOnInit() {
    this.availableCommands()
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getCommandResponse(command: any){
    this.commandResponse = <any>{}
    this.loading = true;
    var re = /edgex-core-command/gi;
    let getObject: any = command.get
    var newUrl = String(getObject.url).replace(re, "127.0.0.1")
    this.apiService.getCommands(newUrl)
    .subscribe(
      (message)=> {
        console.log(JSON.stringify(message))
        this.commandResponse = JSON.parse(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(message)).readings))[0].value);
        this.loading = false;
      });
  }
  
  availableCommands() {   
    this.apiService.getCommands(`http://127.0.0.1:48082/api/v1/device/name/rrs-gateway`)
      .subscribe(
        (message) => {
          let commandArray: any[] = JSON.parse(JSON.stringify(message)).commands
       
        for (var _i = 0; _i < commandArray.length; _i++){
          console.log(commandArray[_i].name)
          this.controllerCommands.push(commandArray[_i])     
        }
      }
      );
  console.log(this.controllerCommands)    
  }
}
