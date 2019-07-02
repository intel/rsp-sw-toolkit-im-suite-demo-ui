import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
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
  }

  ngOnInit() {
        

    this.apiService.getCommands(`http://127.0.0.1:48080/api/v1/event/device/KMC.BAC-121036CE01/valuedescriptor/AnalogValue_40/10`)   
    .subscribe(
      (message) => {
        let result : any[] = JSON.parse(JSON.stringify(message))        
        this.temperatureData = result.map(x => +x.value)      
        this.labelData = result.map(x => x.created)      
        this.lineChartData[0] = { data:  this.temperatureData, label: 'Temperature' }
        this.lineChartLabels = this.labelData;        
      }
    );      

  }

  private generateNumber(i: number) {
    return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
  }


}
