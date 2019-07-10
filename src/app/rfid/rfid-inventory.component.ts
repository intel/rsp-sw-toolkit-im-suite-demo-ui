import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { Tag, LocationHistory } from './tag/tag-event';
import { startWith, switchMap } from 'rxjs/operators';
import { PageEvent, MatTableDataSource } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';

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
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  controllerCommands: string[]
  inventoryGetTagsResponse: Tag[]
  pagedList: Tag[]

  sub: Subscription;
  http: any;

  client: HttpClient;
  loading: boolean;
  loadingTags: boolean;
  loadingCommands: boolean;
  commands: any[];
  sensorIds: string[];
  lastLocation: string;

  tag: Tag;
  tagLocation: LocationHistory[];
  tagCount: number;

  expanded: boolean;
  expandCollapse: string;
  checkmark: string;

  tempCommand: any[];
  tempRead: string;
  tempFacility: string;

  pageEvent: PageEvent;
  setPageSize: number;
  setStartIndex: number;
  setEndIndex: number;
  columnsToDisplay = ['epc', 'uri', 'last_read', 'facility_id'];
  columnAlias = ["EPC", "URI", "LAST READ", "FACILITY ID"]
  expandedElement: Tag | null;
  open: string;
  dataSource: MatTableDataSource<Tag>;

  constructor(private apiService: ApiService) {
    this.controllerCommands = []
    this.inventoryGetTagsResponse = []
    this.tagLocation = []
    this.expanded = false
    this.expandCollapse = "collapse"
    this.open = "collapsed"
    this.tempRead = ""
    this.setStartIndex = 0
    this.setEndIndex = 10
  }

  ngOnInit() {

    this.commands = this.apiService.getRfidControllerCommands()
    this.apiService.myTempCommandsEventEmitter.subscribe((val) => { })
    this.dataSource = new MatTableDataSource()
    interval(1000)
      .pipe(
        startWith(0),
        switchMap(() => this.apiService.getCommands(`http://127.0.0.1:8090/inventory/tags?$orderby=epc asc`))
      )
      .subscribe(
        (message) => {
          let response: Tag[] = (JSON.parse(JSON.stringify(message)).results);
          for (var _i = 0; _i < response.length; _i++) {
            let index = this.dataSource.data.findIndex(x => x.epc == response[_i].epc)
            if (index == -1) {
              this.dataSource.data.push(response[_i])
            } else {
              response[_i].expanded = this.dataSource.data[index].expanded
              this.dataSource.data[index] = response[_i]
            }
          }

          this.dataSource.paginator = this.paginator;

        });
    interval(1000)
      .pipe(
        startWith(0),
        switchMap(() => this.apiService.getCommands(`http://127.0.0.1:8090/inventory/tags/?$count`))
      )
      .subscribe(
        (message) => {
          this.tagCount = (JSON.parse(JSON.stringify(message)).count)
        });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  getTagInfo(tagInfo: Tag) {
    this.tag = JSON.parse(JSON.stringify(tagInfo))
    let sensorGetDeviceIdCommand = this.commands.find(x => x.name == "sensor_get_device_ids")
    let temp = this.apiService.temperatureCommands.find(x => x.name == "CurrentTemperature")

    this.loading = true;
    this.apiService.getCommandResponse(sensorGetDeviceIdCommand)
      .subscribe(
        (message) => {
          this.sensorIds = JSON.parse(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(message)).readings))[0].value);
          this.sensorIds.length > 0 ? this.tempFacility = this.sensorIds[0] : this.tempFacility = ""
          this.loading = false;
        }
      )

    // Temperature reads
    interval(1000)
      .pipe(
        startWith(0),
        switchMap(() => this.apiService.getCommandResponse(temp))
      )
      .subscribe(
        (message) => {
          this.tempRead = parseFloat((JSON.parse(JSON.stringify(message)).AnalogValue_40)).toFixed(2)
        });

    this.loadingTags = true;
    interval(1000)
      .pipe(
        startWith(0),
        switchMap(() => this.apiService.getCommands(`http://127.0.0.1:8090/inventory/tags/?$filter=epc eq '` + this.tag.epc + `'`))
      )
      .subscribe(
        (message) => {
          let response: Tag[] = (JSON.parse(JSON.stringify(message)).results);
          this.tag = response[0]
          this.lastLocation = response[0].location_history[0].location;
          // Tie temperature sensor to first RSP sensor
          if (this.tempRead !== '' || this.tempRead !== undefined) {
            this.tag.temperature = this.tempFacility === this.lastLocation.substring(0, this.lastLocation.length - 2) ? this.tempRead : "N/A"
          }
          this.loadingTags = false;
        });

  }

  isCurrentLocation(sensorId: string): boolean {
    let lastLocationNoAntenna = this.lastLocation.substring(0, this.lastLocation.lastIndexOf("-"))
    if (sensorId == lastLocationNoAntenna) {
      this.checkmark = "✔";
      return true;
    }
    this.checkmark = "";
    return false;
  }

  isCurrentLocationImage(sensorId: string): string {
    let lastLocationNoAntenna = this.lastLocation.substring(0, this.lastLocation.lastIndexOf("-"))
    if (sensorId == lastLocationNoAntenna) {
      return "../assets/sensor.png";
    }
    return "../assets/sensor2.png";
  }

  clickedInfo() {
    if (this.expanded == true) {
      this.expanded = false;
    } else {
      this.expanded = true;
    }
  }

  expandedOrCollapsed(element?: Tag) {
    this.dataSource.data.map(function (x) {
      if (element.epc != x.epc) {
        x.expanded = false
      }
      return x
    })
    let index = this.dataSource.data.findIndex(x => x.epc == element.epc)
    if (this.dataSource.data[index].expanded == undefined) {
      this.dataSource.data[index].expanded = true
    } else {
      if (this.dataSource.data[index].expanded == true) {
        this.dataSource.data[index].expanded = false
      } else {
        this.dataSource.data[index].expanded = true
      }
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
