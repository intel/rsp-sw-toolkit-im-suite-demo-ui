import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { ApiService } from '../services/api.service';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { Subscription, interval } from 'rxjs';
import { startWith, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.scss']
})

export class TemperatureComponent implements OnInit {

  loading: boolean
  thermostat: string
  tempCommand: any[]

  public lineChartData: ChartDataSets[] = [{
    label: "",
    data: []
  } ];
  public lineChartLabels: Label[] 

  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
    },
    annotation: { 
    },
  };

  public lineChartColors: Color[] = [
    { // first color
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

  
  
  temperatureData: number[];
  labelData: string[];

  @ViewChild(BaseChartDirective, { }) chart: BaseChartDirective; 
  

  constructor(private apiService: ApiService) {    
    this.temperatureData = []
    this.thermostat = "KMC.BAC-121036CE01"
  }

  async ngOnInit() {
        
    this.loading = true;

    this.tempCommand = await this.apiService.getTemperatureCommand(this.thermostat) 
    

    this.apiService.getCommands(`http://127.0.0.1:48080/api/v1/reading/name/AnalogValue_40/device/KMC.BAC-121036CE01/50`)   
    .subscribe(
      (message) => {
        let result : any[] = JSON.parse(JSON.stringify(message))        
        this.temperatureData = result.map(x => +x.value)      
        this.labelData = result.map(x => this.timestampToDate(+x.created))      
        this.lineChartData[0].data =  this.temperatureData
        this.lineChartData[0].label = 'Temperature'
        this.lineChartLabels = this.labelData;  
        
        this.loading = false;
      }
    );      

    let temp = this.tempCommand.find(x => x.name == "CurrentTemperature")

    interval(5000)
    .pipe(
      startWith(0),
      switchMap(() => this.apiService.getTemperatureCommandResponse(temp))
    )
    .subscribe(
      (message) => {       
        
        this.lineChartData.forEach((x, i) => {
          const temp = +parseFloat((JSON.parse(JSON.stringify(message)).AnalogValue_40)).toFixed(2) 
          const data: number[] = x.data as number[];
          data.push(temp);
        });      
        
        this.lineChartLabels.push( this.timestampToDate(Date.now()))

      });

  }

  private timestampToDate(timestamp: number): string {
    let date = new Date(timestamp*1000);        
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();      
    let seconds = "0" + date.getSeconds();
    let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime
  }

}
