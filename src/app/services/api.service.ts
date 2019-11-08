import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Command, DeviceCommandRegistration} from '../commands/command';
import {RecordingResponse} from '../loss-prevention/recording-response';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  controllerCommands: any[];
  public temperatureCommands: any[];
  public myTempCommandsEventEmitter: EventEmitter<any[]>;
  public recordingResponse: RecordingResponse;
  public recordingsMap: Map<string, number>;
  public myRecordingsEventEmitter: EventEmitter<RecordingResponse>;

  constructor(private client: HttpClient) {
    this.controllerCommands = [];
    this.recordingsMap = new Map<string, number>();
    this.myTempCommandsEventEmitter = new EventEmitter<any[]>();
    this.myRecordingsEventEmitter = new EventEmitter<RecordingResponse>();

    // Get EdgeX commands for 'KMC.BAC-121036CE01' virtual temperature sensor
    // this.getTemperatureCommand('KMC.BAC-121036CE01');
  }

  getCommands(url: string) {
    return this.client.get(url);
  }

  getNotifications(sender: string, limit: number) {
    const url = 'http://127.0.0.1:48060/api/v1/notification/sender/' + encodeURIComponent(sender) +  '/' + limit;
    return this.client.get(url);
  }

  getRfidControllerCommandRegistration(): Observable<DeviceCommandRegistration> {
    return this.client.get<DeviceCommandRegistration>(`http://127.0.0.1:48082/api/v1/device/name/rsp-controller`);
  }

  getCommandResponse(command: any): Observable<Command> {
    const re = /edgex-core-command/gi;
    const getObject: any = command.get;
    const newUrl = String(getObject.url).replace(re, '127.0.0.1');
    return this.client.get<Command>(newUrl);
  }

 async getBasicSensorInfo(sensor: string): Promise<string> {
    const message = await this.client.get('http://127.0.0.1:48082/api/v1/device/name/' + sensor + '/command/sensor_get_basic_info')
      .toPromise();
    return (JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(message)).readings))[0].value);
  }

  getTemperatureCommand(device: string): void {
    this.client.get('http://127.0.0.1:48082/api/v1/device/name/' + device)
      .subscribe(
        (message) => {
          this.temperatureCommands = JSON.parse(JSON.stringify(message)).commands = JSON.parse(JSON.stringify(message)).commands;
          this.myTempCommandsEventEmitter.emit(this.temperatureCommands);
        }
      );
  }

  // TODO: do we need to make port configurable
  getRecordingsList(): void {
    this.client.get('http://127.0.0.1:9092/recordings')
      .subscribe(
        (message) => {
          this.recordingsMap.clear();
          this.recordingResponse = message as RecordingResponse;
          // reverse them are we want to sort newest first descending
          this.recordingResponse.recordings.reverse();
          this.recordingResponse.recordings.forEach((item, index) => {
            this.recordingsMap[item.folder_name] = index;
          });
          this.myRecordingsEventEmitter.emit(this.recordingResponse);
        }
      );
  }

  deleteRecording(foldername: string): Observable<object> {
    return this.client.delete('http://127.0.0.1:9092/recordings/' + foldername);
  }
}


