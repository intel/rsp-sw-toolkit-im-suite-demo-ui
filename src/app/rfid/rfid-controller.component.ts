import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-rfid-controller',
  templateUrl: './rfid-controller.component.html',
  styleUrls: ['./rfid-controller.component.scss']
})
export class RFIDControllerComponent implements OnInit {

  commands: any[];
  controllerCommands: string[];
  commandResponse: any;

  sub: Subscription;
  http: any;

  client: HttpClient;
  loading: boolean;
  loadingCommands: boolean;
  controllerCommandsResponseObservable: Observable <any[]>;


  constructor(private apiService: ApiService) {
    this.controllerCommands = [];
    this.commands = [];
  }

  ngOnInit() {
    this.getCommands();
    console.log(this.commands);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  async getCommands() {
    const deviceCommandRegistration = await this.apiService.getRfidControllerCommandRegistration().toPromise();
    this.commands = deviceCommandRegistration.commands;
  }

  getCommandResponse(command: any) {
    this.commandResponse = {} as any;
    this.loading = true;
    this.apiService.getCommandResponse(command)
    .subscribe(
      (message) => {

        if (command ===  'gpio_clear_mappings' || command.name === 'inventory_unload') {
          this.commandResponse = 'OK';
        } else {
          this.commandResponse = JSON.parse(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(message)).readings))[0].value);
        }
        if (command.name === 'cluster_get_config' && this.commandResponse === null) {
          this.commandResponse = 'No cluster configuration.';
        }
        console.log(this.commandResponse);
        console.log(message);
        this.loading = false;
      },
      ( error ) => {
        this.loading = false;
        this.commandResponse = JSON.parse(JSON.stringify(error));
        console.log(error);
      }
    );
  }
}
