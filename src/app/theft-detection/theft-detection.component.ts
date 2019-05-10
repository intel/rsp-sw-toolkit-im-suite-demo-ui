import { Component, OnInit } from '@angular/core';
import { BufferService } from '../services/buffer.service';
import { WebsocketService } from '../services/websocket.service';
import { Subscription } from 'rxjs';


interface posItem {
  product_name: string;
  quantity: number;
  quantity_unit: string;
  unit_price: number;
  reconciled: boolean;
}
interface scaleItem {
  scale_id: string;
  status: string;
  total: string;
  units: string;
}
interface data {
  POS_items: Array<posItem>;
  SCALE_item: scaleItem;
}

@Component({
  selector: 'app-theft-detection',
  templateUrl: './theft-detection.component.html',
  styleUrls: ['./theft-detection.component.scss']
})
export class TheftDetectionComponent implements OnInit {

  posReadings: posItem[]
  scaleReading: scaleItem
  scaleTotal: any;
  scaleUnit: any;

  sub: Subscription;

  constructor(private chatService: BufferService, private websocketService: WebsocketService) {
    this.posReadings = []
    this.scaleReading = {} as scaleItem
  }

  ngOnInit() {
    this.sub = this.websocketService.getDataSub()
      .subscribe(

        (message) => {
          console.log(message)
          message = JSON.stringify(message);

          let obj: data = JSON.parse(message) as data;

          this.scaleTotal = obj.SCALE_item.total;
          this.scaleUnit = obj.SCALE_item.units

          this.posReadings = obj.POS_items;
          this.scaleReading = obj.SCALE_item;

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
