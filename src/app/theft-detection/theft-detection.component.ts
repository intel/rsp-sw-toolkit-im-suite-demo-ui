import { Component, OnInit } from '@angular/core';
import { BufferService } from '../services/buffer.service';
import { WebsocketService } from '../services/websocket.service';
import { Subscription } from 'rxjs';


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
  selector: 'app-theft-detection',
  templateUrl: './theft-detection.component.html',
  styleUrls: ['./theft-detection.component.scss']
})
export class TheftDetectionComponent implements OnInit {

  posReadings: posItem[]
  suspectItems: scaleItem[]
  scaleReading: scaleItem
  scaleTotal: any;
  scaleUnit: any;

  sub: Subscription;

  constructor(private websocketService: WebsocketService) {
    this.posReadings = []
    this.suspectItems = []
    this.scaleReading = {} as scaleItem
  }

  ngOnInit() {
    this.sub = this.websocketService.getDataSub()
      .subscribe(
        (message) => {
          console.log(message)
          message = JSON.stringify(message);

          let obj: data = JSON.parse(message) as data;

          obj.positems.forEach((item, index) => {
            if (item.product_id === "") { obj.positems.splice(index, 1); }
          });

          if (obj.hasOwnProperty('scaleitem')) {
            this.scaleReading = obj.scaleitem;
          } else {
            this.scaleReading = { total: "0", units: "" } as scaleItem
          }

          this.scaleTotal = this.scaleReading.total;
          this.scaleUnit = this.scaleReading.units
          this.posReadings = obj.positems;
          this.suspectItems = obj.suspectitems;
        },
        (err) => console.error(err),
        () => console.warn('Completed!')

        // console.log(incomingData)
      );
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
