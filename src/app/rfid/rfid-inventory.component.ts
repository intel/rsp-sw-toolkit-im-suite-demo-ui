import { Component, OnInit } from '@angular/core';
import { BufferService } from '../services/buffer.service';
import { WebsocketService } from '../services/websocket.service';
import { Subscription, interval } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Tag, LocationHistory } from './tag/tag-event';
import { startWith, switchMap } from 'rxjs/operators';


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
  inventoryGetTagsResponse: Tag[]
  suspectItems: scaleItem[]
  scaleReading: scaleItem
  scaleTotal: any;
  scaleUnit: any;

  sub: Subscription;
  http: any;

  client: HttpClient;
  loading: boolean;
  loadingCommands: boolean;
  commands: any[];
  sensorIds: string[];
  lastLocation: string;

  tag: Tag;
  tagLocation: LocationHistory[];
  tagCount: number;
  

  constructor(private apiService: ApiService) {
    this.controllerCommands = []
    this.inventoryGetTagsResponse = []
    this.tagLocation = []
    this.suspectItems = []
    this.scaleReading = {} as scaleItem
  }

  ngOnInit() {
    this.commands = this.apiService.getRfidControllerCommands()
    interval(1000)
    .pipe(
      startWith(0),
      switchMap(() => this.apiService.getCommands(`http://127.0.0.1:8090/inventory/tags`))
    )
    .subscribe(
      (message)=> {
        this.inventoryGetTagsResponse = [];
        let response: any[] = (JSON.parse(JSON.stringify(message)).results);
        for (var _i = 0; _i < response.length; _i++){
          this.inventoryGetTagsResponse.push(response[_i]) 
        }
      });
    interval(1000)
    .pipe(
      startWith(0),
      switchMap(() => this.apiService.getCommands(`http://127.0.0.1:8090/inventory/tags/?$count`))
    )
    .subscribe(
      (message)=> {
        this.tagCount = (JSON.parse(JSON.stringify(message)).count)
      });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getTags(){
    this.loading = true;
    this.apiService.getCommands(`http://127.0.0.1:8090/inventory/tags`)
    .subscribe(
      (message)=> {
        let response: any[] = (JSON.parse(JSON.stringify(message)).results);
        for (var _i = 0; _i < response.length; _i++){
          this.inventoryGetTagsResponse.push(response[_i]) 
        }
        this.loading = false;
      });
  }

  getTagInfo(tagInfo: Tag){
    this.tag = JSON.parse(JSON.stringify(tagInfo))
    let sensorGetDeviceIdCommand = this.commands.find(x => x.name == "sensor_get_device_ids")
    this.loading = true;
    this.apiService.getRfidControllerCommandResponse(sensorGetDeviceIdCommand)
    .subscribe(
      (message)=> {
        this.sensorIds = JSON.parse(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(message)).readings))[0].value);
        console.log(this.sensorIds)
        this.loading = false;
      }
    )

    interval(1000)
    .pipe(
      startWith(0),
      switchMap(() => this.apiService.getCommands(`http://127.0.0.1:8090/inventory/tags/?$filter=epc eq '`+ this.tag.epc + `'`))
    )
    .subscribe(
      (message)=> {
        let response: Tag[] = (JSON.parse(JSON.stringify(message)).results);
        console.log(response[0])
        this.lastLocation = response[0].location_history[0].location;
      });
    
  }

  isCurrentLocation(sensorId: string) : boolean {
    let lastLocationNoAntenna = this.lastLocation.substring(0,this.lastLocation.lastIndexOf("-"))
    console.log(this.lastLocation)
    if(sensorId == lastLocationNoAntenna){
      return true;
    }
    return false;
  }

  isCurrentLocationImage(sensorId: string) : string {
    let lastLocationNoAntenna = this.lastLocation.substring(0,this.lastLocation.lastIndexOf("-"))
    console.log(this.lastLocation)
    if(sensorId == lastLocationNoAntenna){
      return "../assets/sensor.png";
    }
    return "../assets/sensor2.png";
  }

  
}
