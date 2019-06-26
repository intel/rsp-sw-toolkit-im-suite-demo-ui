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

  tag: Tag
  tagLocation: LocationHistory[]
  

  constructor(private apiService: ApiService) {
    this.controllerCommands = []
    this.inventoryGetTagsResponse = []
    this.tagLocation = []
    this.suspectItems = []
    this.scaleReading = {} as scaleItem
  }

  ngOnInit() {
    // this.getTags();
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
        this.loading = false;
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
    // console.log(JSON.parse(JSON.stringify(tagInfo)).loc)
    this.tagLocation = JSON.parse(JSON.stringify(tagInfo)).location_history
    this.tag = JSON.parse(JSON.stringify(tagInfo))
    console.log(this.tag)
    console.log(this.tag.location_history[1])
    // console.log(tag)
    // for (var _i = 0; _i < tagInfo.locationHistory.length; _i++){
    //   this.tagLocation.push(tagInfo.locationHistory[_i]) 
    // }
    // console.log(tag.location_history)
    // this.tagLocation.push(tagInfo.locationHistory);
  }
  
  // availableCommands() {   
  //   this.loadingCommands  = true;
  //   this.apiService.getCommands(`http://127.0.0.1:48082/api/v1/device/name/rrs-gateway`)
  //     .subscribe(
  //       (message) => {
  //         let commandArray: any[] = JSON.parse(JSON.stringify(message)).commands
       
  //       for (var _i = 0; _i < commandArray.length; _i++){
  //         console.log(commandArray[_i].name)
  //         this.controllerCommands.push(commandArray[_i])     
  //       }
  //       this.loadingCommands = false;
  //     }
  //     );
  // console.log(this.controllerCommands)    
  // }
}
