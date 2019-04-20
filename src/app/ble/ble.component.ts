import { Component, OnInit } from '@angular/core';
import { BufferService } from '../services/buffer.service';

@Component({
  selector: 'app-ble',
  templateUrl: './ble.component.html',
  styleUrls: ['./ble.component.scss']
})
export class BleComponent implements OnInit {
  bleDevices: any[];

  constructor(private bufferService: BufferService) {
    bufferService.messages.subscribe(msg => {
      if (msg.length > 0 && msg[0].device === 'device-ble') {
        this.bleDevices = msg;
      } else if (msg.length === 0) {
        this.bleDevices = [];
      }
    });
  }
  ngOnInit() {
  }
  connect(uuid: any) {
    const val = JSON.parse(uuid);
    this.bufferService.connectToDevice(val.uuid);
  }
}
