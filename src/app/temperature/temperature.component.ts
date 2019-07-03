import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color,Label } from 'ng2-charts';
import { ApiService } from '../services/api.service';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { Subscription, interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.scss']
})

export class TemperatureComponent implements OnInit {

  loading: boolean
  thermostat: string  
  temperatureData: number[];
  labelData: string[]; 

  public lineChartData: ChartDataSets[] = [{
    label: "",
    data: []
  }];
  public lineChartLabels: Label[]

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

  constructor(private apiService: ApiService) {
     this.temperatureData = []
    this.thermostat = "KMC.BAC-121036CE01"    
  }
 
  ngOnInit() {

    this.loading = true;

    // Get call to EdgeX Readings core data 
    this.apiService.getCommands(`http://127.0.0.1:48080/api/v1/reading/name/AnalogValue_40/device/KMC.BAC-121036CE01/50`)
      .subscribe(
        (message) => {
          let result: any[] = JSON.parse(JSON.stringify(message))
          this.temperatureData = result.map(x => +x.value)
          this.labelData = result.map(x => this.timestampToDate(new Date(+x.created * 1000)))
          this.lineChartData[0].data = this.temperatureData
          this.lineChartData[0].label = 'Temperature'
          this.lineChartLabels = this.labelData;

          this.loading = false;
        }
      );

      this.apiService.myTempCommandsEventEmitter.subscribe((val) => {        
        this.getRealTimeData(val.find(x => x.name == "CurrentTemperature"))    
      })

      if(this.apiService.temperatureCommands !== undefined){        
        this.getRealTimeData(this.apiService.temperatureCommands.find(x => x.name == "CurrentTemperature"))    
      }
      
  }

  // Make a command call to get current temperature every 2 seconds.
  private getRealTimeData(tempCommand: any[]){
    interval(2000)
    .pipe(
      startWith(0),
      switchMap(() => this.apiService.getCommandResponse(tempCommand))
    )
    .subscribe(
      (message) => {

        this.lineChartData.forEach((x, i) => {
          const temp = +parseFloat((JSON.parse(JSON.stringify(message)).AnalogValue_40)).toFixed(2)
          const data: number[] = x.data as number[];
          data.push(temp);
        });
        let date = new Date()
        this.lineChartLabels.push(this.timestampToDate(date))

      });
  }

  private timestampToDate(date: Date): string {
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();
    let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime
  }
}
