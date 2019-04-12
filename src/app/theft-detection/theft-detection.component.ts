import { Component, OnInit } from '@angular/core';
import { BufferService } from '../services/buffer.service';

@Component({
  selector: 'app-theft-detection',
  templateUrl: './theft-detection.component.html',
  styleUrls: ['./theft-detection.component.scss']
})
export class TheftDetectionComponent implements OnInit {
  posReadings: any[]
  scaleReadings: any[]
  constructor(private chatService: BufferService) {
    chatService.messages.subscribe(msg => {
      if (msg.length > 0 && msg[0].device === 'device-plog') {
        this.posReadings = msg
      } else if (msg.length > 0 && msg[0].device === 'device-scale') {
        this.scaleReadings = msg
      }else if(msg.length === 0){
        this.posReadings = [];
        this.scaleReadings = [];
      }
    });
  }

  ngOnInit() {
  }

}
