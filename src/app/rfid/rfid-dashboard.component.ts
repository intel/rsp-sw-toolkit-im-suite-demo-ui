import { Component, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { HttpClient, } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { startWith, switchMap } from 'rxjs/operators';
import {DeviceCommandRegistration} from '../commands/command';

@Component({
  selector: 'app-rfid-dashboard',
  templateUrl: './rfid-dashboard.component.html',
  styleUrls: ['./rfid-dashboard.component.scss']
})
export class RFIDDashboardComponent implements OnInit {

  tagCount: number;
  commandResponse: any;
  sensorCount: number;

  sub: Subscription;


  constructor(private apiService: ApiService, private client: HttpClient) {
  }

  async ngOnInit() {
    interval(1000)
      .pipe(
        startWith(0),
        switchMap(() => this.client.get(`http://127.0.0.1:8090/inventory/tags/?$count`))
      )
      .subscribe(
        (message) => {
          this.tagCount = (JSON.parse(JSON.stringify(message)).count);
        });
    const deviceCommandRegistration: DeviceCommandRegistration = await this.apiService.getRfidControllerCommandRegistration().toPromise();

    const sensorGetIdsCmd =  deviceCommandRegistration.commands.filter( e => e.name === 'sensor_get_device_ids');

    console.log(sensorGetIdsCmd);
    this.apiService.getCommandResponse(sensorGetIdsCmd[0])
      .subscribe(
        (message) => {


          this.commandResponse = JSON.parse(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(message)).readings))[0].value);

          this.sensorCount = this.commandResponse.length;
          console.log(message);
        },
        ( error ) => {
          this.commandResponse = JSON.parse(JSON.stringify(error));
          console.log(error);
        }
      );

  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
