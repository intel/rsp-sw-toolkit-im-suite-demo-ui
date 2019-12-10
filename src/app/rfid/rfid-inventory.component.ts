/* Apache v2 license
*  Copyright (C) <2019> Intel Corporation
*
*  SPDX-License-Identifier: Apache-2.0
*/

import {Component, OnInit, ViewChild} from '@angular/core';
import {interval, Subscription} from 'rxjs';
import {ApiService} from '../services/api.service';
import {LocationHistory, Tag} from './tag/tag-event';
import {startWith, switchMap} from 'rxjs/operators';
import {MatTableDataSource, PageEvent} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatPaginator} from '@angular/material/paginator';
import {SensorInfo} from './sensor/sensor';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from '../shared/custom-validators';
import {DatePipe} from '@angular/common';
import {Command} from '../commands/command';
import {AppConfigService} from '../services/app-config-service';

@Component({
  selector: 'app-rfid-inventory',
  templateUrl: './rfid-inventory.component.html',
  styleUrls: ['./rfid-inventory.component.scss', 'table-expandable-rows-example.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class RFIDInventoryComponent implements OnInit {


  constructor(private apiService: ApiService, private builder: FormBuilder, private appConfigService: AppConfigService) {
    this.controllerCommands = [];
    this.inventoryGetTagsResponse = [];
    this.tagLocation = [];
    this.expanded = false;
    this.showRow = false;
    this.expandCollapse = 'collapse';
    this.open = 'collapsed';
    this.tempRead = '';
    this.setStartIndex = 0;
    this.setEndIndex = 10;
    this.commands = [];
    this.aliasesArr = [];
    this.basicSensorInfo = [];
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  controllerCommands: string[];
  inventoryGetTagsResponse: Tag[];
  pagedList: Tag[];

  sub: Subscription;
  http: any;

  loading: boolean;
  loadingTags: boolean;
  commands: any[];
  sensorIds: string[];
  lastLocation: string;

  tag: Tag;
  tagLocation: LocationHistory[];

  expanded: boolean;
  showRow: boolean;
  expandCollapse: string;
  checkmark: string;

  tempRead: string;
  tempFacility: string;
  freezerReaderName: string;

  pageEvent: PageEvent;
  setPageSize: number;
  setStartIndex: number;
  setEndIndex: number;
  columnsToDisplay = ['epc', 'uri', 'last_read', 'facility_id'];
  columnAlias = ['EPC', 'URI', 'LAST READ', 'FACILITY ID'];
  expandedElement: Tag | null;
  open: string;
  dataSource: MatTableDataSource<Tag>;

  aliasesArr: string[];
  basicSensorInfo: SensorInfo[];
  searchForm: FormGroup;

  private static base64ToFloat(base64: string): string {
    return new DataView(Uint8Array.from(
        Array.prototype.map.call(atob(base64),
         c => c.charCodeAt(0)))
         .buffer)
         .getFloat32(0, false)
         .toFixed(2);
 }

 async ngOnInit() {
    this.getAliases();
    this.apiService.myTempCommandsEventEmitter.subscribe((val) => { });
    this.dataSource = new MatTableDataSource();

    this.apiService.getCommands(`http://127.0.0.1:8090/inventory/tags?$orderby=epc asc`)
      .subscribe(
        (message) => {
          const response: Tag[] = (JSON.parse(JSON.stringify(message)).results);
          for (let i = 0; i < response.length; i++) {
            const index = this.dataSource.data.findIndex(x => x.epc === response[i].epc);
            if (index === -1) {
              this.dataSource.data.push(response[i]);
            } else {
              response[i].expanded = this.dataSource.data[index].expanded;
              this.dataSource.data[index] = response[i];
            }
          }
          this.dataSource.paginator = this.paginator;

        });
    this.buildForm();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  buildForm() {
    this.searchForm = this.builder.group({
      epc: new FormControl('', [Validators.pattern('^[a-zA-Z0-9_]*$'), Validators.required, Validators.maxLength(24)])
    });
  }

  async getAliases() {
    const deviceCommandRegistration = await this.apiService.getRfidControllerCommandRegistration().toPromise();

    const sensorGetDeviceIdCommand = deviceCommandRegistration.commands.find(x => x.name === 'sensor_get_device_ids');
    const results: Command  = await this.apiService.getCommandResponse(sensorGetDeviceIdCommand).toPromise();
    this.sensorIds = JSON.parse(results.readings[0].value);

    let bsi: SensorInfo;
    this.sensorIds.forEach(async (val) => {
      const bsiResults = await this.apiService.getBasicSensorInfo(val);
      this.loading = false;
      const aliasesArr: string[] = JSON.parse(bsiResults).aliases;
      const uniqueAliases: Set<string> = new Set(aliasesArr);
      bsi = { sensor: val, aliases: uniqueAliases};
      this.basicSensorInfo.push(bsi);
    });
  }

  async getTagInfo(tagInfo: Tag) {

    this.loading = false;
    this.tag = JSON.parse(JSON.stringify(tagInfo));

    const configurationVariables = await this.appConfigService.getConfig();
    const temperatureDevice = JSON.parse(JSON.stringify(configurationVariables)).temperatureDevice;
    this.freezerReaderName = JSON.parse(JSON.stringify(configurationVariables)).freezerReaderName;

    let temp;
    try {
      if (this.apiService.temperatureCommands !== undefined) {
        temp = this.apiService.temperatureCommands.find(x => x.name === 'CurrentTemperature');
      }
    } catch (err) {
      console.log(err);
    }

    // Temperature reads
    interval(1000)
    .pipe(
      startWith(0),
      switchMap(() => this.apiService.getCommands(`http://127.0.0.1:48080/api/v1/reading/name/Temperature/device/` + temperatureDevice + `/1`))
    )
    .subscribe(
      (message) => {
        const result: any[] = JSON.parse(JSON.stringify(message));
        if (result.length > 0) {
          this.tempRead = RFIDInventoryComponent.base64ToFloat(result[0].value);
        }
      },
      (error) => {
        console.log(error);
      });

    this.loadingTags = true;
    interval(1000)
      .pipe(
        startWith(0),
        switchMap(() => this.apiService.getCommands(`http://127.0.0.1:8090/inventory/tags/?$filter=epc eq '` + this.tag.epc + `'`))
      )
      .subscribe(
        (message) => {
          const response: Tag[] = (JSON.parse(JSON.stringify(message)).results);
          this.tag = response[0];
          this.lastLocation = response[0].location_history[0].location;
          // Tie temperature sensor to first RSP sensor
          if (this.tempRead !== '' || this.tempRead !== undefined) {
            this.tag.temperature = this.freezerReaderName === this.lastLocation ? this.tempRead : 'N/A';
          }
          this.loadingTags = false;
        });

  }

  isCurrentLocation(sensorId: string): boolean {
    // tslint:disable-next-line:triple-equals
    if (this.lastLocation != undefined) {
      if (sensorId === this.lastLocation) {
        this.checkmark = '✔';
        return true;
      }
    }
    this.checkmark = '';
    return false;
  }

  clickedInfo() {
    if (this.expanded === true) {
      this.expanded = false;
    } else {
      this.expanded = true;
    }
  }

  expandedOrCollapsed(element?: Tag) {
    this.dataSource.data.map(function(x) {
      if (element.epc != x.epc) {
        x.expanded = false;
      }
      return x;
    });
    const index = this.dataSource.data.findIndex(x => x.epc === element.epc);
    if (this.dataSource.data[index].expanded == undefined) {
      this.dataSource.data[index].expanded = true;
    } else {
      if (this.dataSource.data[index].expanded == true) {
        this.dataSource.data[index].expanded = false;
      } else {
        this.dataSource.data[index].expanded = true;
      }
    }

    if (this.showRow === true) {
      this.showRow = false;
    } else {
      this.showRow = true;
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
