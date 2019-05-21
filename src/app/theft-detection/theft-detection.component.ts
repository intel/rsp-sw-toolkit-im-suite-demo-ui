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
  POS_items: Array<posItem>;
  SCALE_item: scaleItem;
  SUSPECT_items: Array<scaleItem>;
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

          obj.POS_items.forEach((item, index) => {
            if (item.product_id === "") { obj.POS_items.splice(index, 1); }
          });

          this.scaleTotal = obj.SCALE_item.total;
          this.scaleUnit = obj.SCALE_item.units
          this.posReadings = obj.POS_items;
          this.suspectItems = obj.SUSPECT_items;

          if (obj.hasOwnProperty('SCALE_item')) {
            this.scaleReading = obj.SCALE_item;
          } else {
            console.log("Expecting failure here")
            this.scaleReading = { total: "0" } as scaleItem
          }
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
