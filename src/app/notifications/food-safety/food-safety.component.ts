/* Apache v2 license
*  Copyright (C) <2019> Intel Corporation
*
*  SPDX-License-Identifier: Apache-2.0
*/

import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { PageEvent, MatTableDataSource, MatDatepickerInputEvent} from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { Notification } from '../notification/notification';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { DatePipe } from '@angular/common';
import {CustomValidators} from '../../shared/custom-validators';

@Component({
  selector: 'app-food-safety',
  templateUrl: './food-safety.component.html',
  styleUrls: ['./food-safety.component.scss'],
  providers: [DatePipe],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class NotifsFoodSafetyComponent implements OnInit {

  constructor(private apiService: ApiService, private datePipe: DatePipe, private builder: FormBuilder) {
    this.controllerCommands = [];
    this.open = 'collapsed';
    this.setStartIndex = 0;
    this.setEndIndex = 10;
  }

  get fromDate() { return this.filterForm.get('fromDate').value; }
  get toDate() {
    const tempDate = new Date(this.filterForm.get('toDate').value);
    // add hours to equal the end of the day selected
    tempDate.setHours(23, 59, 59, 999);
    return tempDate;
  }
  get sender() { return this.filterForm.get('sender').value; }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  controllerCommands: string[];

  sub: Subscription;
  http: any;

  client: HttpClient;
  loading: boolean;


  pageEvent: PageEvent;
  setPageSize: number;
  setStartIndex: number;
  setEndIndex: number;
  columnsToDisplay = ['created', 'sender', 'labels', 'content'];
  columnAlias = ['CREATED', 'SENDER', 'LABELS', 'CONTENT'];
  open: string;
  dataSource: MatTableDataSource<Notification>;
  dateEvents: string;

  filterForm: FormGroup;

  ngOnInit() {
    this.apiService.myTempCommandsEventEmitter.subscribe((val) => { });
    this.dataSource = new MatTableDataSource();
    this.buildForm();

  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  buildForm() {
    this.filterForm = this.builder.group({
      fromDate: new FormControl('', [CustomValidators.DateError]),
      toDate: new FormControl('', [CustomValidators.DateError]),
      sender: new FormControl('', [Validators.pattern('^[-a-zA-Z0-9_ ]*$'), Validators.required, Validators.maxLength(25)])
    });
  }

  addEvent(event: MatDatepickerInputEvent<Date>) {
    this.dateEvents = `${event.value.getTime()}`;

    this.dataSource.filterPredicate = (data) => {
      if (this.fromDate && this.toDate) {
        return data.created >= this.datePipe.transform(this.fromDate + 1, 'MM/dd/yyyy HH:mm:ss a')
          && data.created <= this.datePipe.transform(this.toDate, 'MM/dd/yyyy HH:mm:ss a');
      }
      return true;
    };

  }

  getNotifications() {
    this.apiService.getNotifications(this.sender, 100)
      .subscribe(
        (message) => {
          const response: Notification[] = (JSON.parse(JSON.stringify(message)));
          if (response.length === 0) {
            this.dataSource.data = [];
          } else {
            for (let i = 0; i < response.length; i++) {
              const myDate = new Date(response[i].created);
              response[i].created = this.datePipe.transform(myDate, 'MM/dd/yyyy HH:mm:ss a')
              this.dataSource.data[i] = response[i];
            }
            this.dataSource.paginator = this.paginator;
          }
        });
  }

  submit() {
    if ( !(this.filterForm.status === 'INVALID')) {
      this.getNotifications();
      this.applyFilter();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  applyFilter() {
    this.dataSource.filter = '' + Math.random();
  }
}
