import { Component, OnInit } from '@angular/core';
import { BufferService } from '../services/buffer.service';
import { WebsocketService } from '../services/websocket.service';
import { Subscription, Observable, interval } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-rfid-dashboard',
  templateUrl: './rfid-dashboard.component.html',
  styleUrls: ['./rfid-dashboard.component.scss']
})
export class RFIDDashboardComponent implements OnInit {

  tagCount: number;

  sub: Subscription;


  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    interval(1000)
      .pipe(
        startWith(0),
        switchMap(() => this.apiService.getCommands(`http://127.0.0.1:8090/inventory/tags/?$count`))
      )
      .subscribe(
        (message) => {
          this.tagCount = (JSON.parse(JSON.stringify(message)).count)
        });
  }
  
  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }
}
