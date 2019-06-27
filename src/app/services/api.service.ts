import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable()
export class ApiService {
  controllerCommands: any[]
  commandResponse: any

  constructor(private client: HttpClient) {
    this.controllerCommands = []
   }

  getCommands(url: string){
    return this.client.get(url);
  }

  getRfidControllerCommands() : any[]{
    this.client.get(`http://127.0.0.1:48082/api/v1/device/name/rrs-gateway`)
      .subscribe(
        (message) => {
          let commandArray: any[] = JSON.parse(JSON.stringify(message)).commands
       
        for (var _i = 0; _i < commandArray.length; _i++){
          this.controllerCommands.push(commandArray[_i])  
        }
      }
      );
      console.log(this.controllerCommands)
      return this.controllerCommands
  }

  getRfidControllerCommandResponse(command: any) : Observable<any> {
  this.commandResponse = <any>{}
    var re = /edgex-core-command/gi;
    let getObject: any = command.get
    var newUrl = String(getObject.url).replace(re, "127.0.0.1")
    return this.client.get(newUrl)
  }
}
