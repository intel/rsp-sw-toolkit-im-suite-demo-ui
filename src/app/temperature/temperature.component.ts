import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { ApiService } from '../services/api.service';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {AppConfigService} from '../services/app-config-service';

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.scss']
})

export class TemperatureComponent implements OnInit {

  constructor(private apiService: ApiService, private client: HttpClient, private appConfigService: AppConfigService) {
     this.temperatureData = [];
  }

  loading: boolean;
  thermostat: string;
  temperatureData: number[];
  labelData: string[];

  public lineChartData: ChartDataSets[] = [{
    label: '',
    data: []
  }];
  public lineChartLabels: Label[];

  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
    },
    annotation: {
    },
  };

  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(225,10,24,0.2)',
      borderColor: 'rgba(225,10,24,0.2)',
      pointBackgroundColor: 'rgba(225,10,24,0.2)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(225,10,24,0.2)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [pluginAnnotations];

  private static base64ToFloat(base64: string): string {
   return new DataView(Uint8Array.from(
       Array.prototype.map.call(atob(base64),
        c => c.charCodeAt(0)))
        .buffer)
        .getFloat32(0, false)
        .toFixed(2);
}

  async ngOnInit() {

    this.loading = true;

    const configurationVariables = await this.appConfigService.getConfig();
    if (configurationVariables === undefined) {
      this.loading = false;
      console.log('Empty configuration variables, check for expected configuration file.');
    } else {
    const temperatureDevice = JSON.parse(JSON.stringify(configurationVariables)).temperatureDevice;

    // Get call to EdgeX Readings core data
    this.client.get(`http://127.0.0.1:48080/api/v1/reading/name/Temperature/device/` + temperatureDevice + `/5`)
      .subscribe(
        (message) => {
          const result: any[] = JSON.parse(JSON.stringify(message));


          this.temperatureData = result.map(x => +parseFloat(TemperatureComponent.base64ToFloat(x.value)));
          this.labelData = result.map(x => this.timestampToDate(new Date(+x.created * 1000)));
          this.lineChartData[0].data = this.temperatureData;
          this.lineChartData[0].label = 'Temperature';
          this.lineChartLabels = this.labelData;

          this.loading = false;
          this.getRealTimeData(temperatureDevice);
        }
      );


    }
  }


  // Make a command call to get current temperature every 5 seconds.
  private getRealTimeData(temperatureDevice: string) {
    interval(5000)
    .pipe(
      startWith(0),
      switchMap(() => this.apiService.getCommands(`http://127.0.0.1:48080/api/v1/reading/name/Temperature/device/` + temperatureDevice + `/1`))
    )
    .subscribe(
      (message) => {
        const result: any[] = JSON.parse(JSON.stringify(message));
        if (result.length > 0) {
            this.lineChartData.forEach((x, i) => {
                const temp = +parseFloat(TemperatureComponent.base64ToFloat(result[0].value));
                const data: number[] = x.data as number[];
                data.push(temp);
              });
            const date = new Date();
            this.lineChartLabels.push(this.timestampToDate(date));
        }
      });
  }

  private timestampToDate(date: Date): string {
    const hours = date.getHours();
    const minutes = '0' + date.getMinutes();
    const seconds = '0' + date.getSeconds();
    const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
  }
}
