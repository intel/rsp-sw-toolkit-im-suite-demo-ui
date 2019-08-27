import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { subscribeOn } from 'rxjs/operators';

@Injectable()
export class ApiService {
  controllerCommands: any[]
  commandResponse: any
  public temperatureCommands: any[]
  public myTempCommandsEventEmitter: EventEmitter<any[]>

  constructor(private client: HttpClient) {
    this.controllerCommands = []
    this.myTempCommandsEventEmitter = new EventEmitter<any[]>()

    // Get EdgeX commands for 'KMC.BAC-121036CE01' virtual temperature sensor
    this.getTemperatureCommand("KMC.BAC-121036CE01")
  }

  getCommands(url: string) {
    return this.client.get(url);
  }

  getRfidControllerCommands(): any[] {
    this.controllerCommands = []
    this.client.get(`http://127.0.0.1:48082/api/v1/device/name/rsp-controller`)
      .subscribe(
        (message) => {
          let commandArray: any[] = JSON.parse(JSON.stringify(message)).commands

          for (var _i = 0; _i < commandArray.length; _i++) {
            this.controllerCommands.push(commandArray[_i])
          }
        }
      );
    return this.controllerCommands
  }

  getCommandResponse(command: any): Observable<any> {
    this.commandResponse = <any>{}
    var re = /edgex-core-command/gi;
    let getObject: any = command.get
    var newUrl = String(getObject.url).replace(re, "127.0.0.1")
    return this.client.get(newUrl)
  }

  getTemperatureCommand(device: string): void {
    
    this.client.get("http://127.0.0.1:48082/api/v1/device/name/"+device)
      .subscribe(
        (message) => {
          this.temperatureCommands = JSON.parse(JSON.stringify(message)).commands = JSON.parse(JSON.stringify(message)).commands
          this.myTempCommandsEventEmitter.emit(this.temperatureCommands)       
        }
      );        
  } 

}


