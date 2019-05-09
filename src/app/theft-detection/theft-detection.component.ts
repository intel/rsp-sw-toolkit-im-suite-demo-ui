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

  constructor(private chatService: BufferService, private websocketService: WebsocketService) { }

  ngOnInit() {
    this.sub = this.websocketService.getQuotes()
      .subscribe(incomingData => {

        let obj: data = JSON.parse(incomingData);
        this.scaleTotal = obj.SCALE_item.total;
        this.scaleUnit = obj.SCALE_item.units

        this.posReadings = obj.POS_items;
        this.scaleReading = obj.SCALE_item

      });
    this.posReadings = []
    this.scaleReading = {} as scaleItem
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
