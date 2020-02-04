/* Apache v2 license
*  Copyright (C) <2019> Intel Corporation
*
*  SPDX-License-Identifier: Apache-2.0
*/

import {async, inject, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Injectable} from '@angular/core';
import {NotifyFoodSafetyComponent} from './food-safety.component';
import {ApiService} from '../../services/api.service';
import {DatePipe} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatTableModule} from '@angular/material';
import {By} from '@angular/platform-browser';
import { Notification } from '../notification/notification';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('NotifyFoodSafetyComponent', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NotifyFoodSafetyComponent
      ],
      imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule,
        MatNativeDateModule, MatTableModule, HttpClientTestingModule],
      providers: [ApiService, DatePipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(NotifyFoodSafetyComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  }));

  it('should create a component', async () => {
    expect(component).toBeTruthy();
  });

  it('should call submit() by clicking the submit button', async () => {
    spyOn(component, 'submit');
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);
    expect(component.submit).toHaveBeenCalled();
    expect(component.filterForm).toBeTruthy();
  });

  it('should call addEvent() by clicking the toDate', async () => {
    spyOn(component, 'addEvent');
    const button = fixture.debugElement.query(By.css('input[formControlName=toDate]'));
    button.triggerEventHandler('dateInput', null);
    expect(component.addEvent).toHaveBeenCalled();
  });

  it('should call addEvent method by clicking the fromDate', async () => {
    spyOn(component, 'addEvent');
    const button = fixture.debugElement.query(By.css('input[formControlName=fromDate]'));
    button.triggerEventHandler('dateInput', null);
    expect(component.addEvent).toHaveBeenCalled();
  });

  it('should test initial fromDate field validity', async () => {
    const fromDate = component.filterForm.controls.fromDate;
    expect(fromDate.valid).toBeFalsy();
  });

  it('should test initial toDate field validity', async () => {
    const toDate = component.filterForm.controls.toDate;
    expect(toDate.valid).toBeFalsy();
  });

  it('should test initial sender field validity', async () => {
    const sender = component.filterForm.controls.sender;
    expect(sender.valid).toBeFalsy();
  });

  it('should test sender field required validator', async () => {
    const sender = component.filterForm.controls.sender;
    expect(sender.errors.required).not.toBeNull();
    sender.setValue('test');
    expect(sender.errors).toBeNull();
  });

  it('should test fromDate field required validator', async () => {
    const fromDate = component.filterForm.controls.fromDate;
    expect(fromDate.errors.DateError).toBeTruthy();
  });

  it('should test toDate field required validator', async () => {
    const toDate = component.filterForm.controls.toDate;
    expect(toDate.errors.DateError).not.toBeNull();
    toDate.setValue('1/03/2020');
    expect(toDate.errors).toBeNull();
  });

  it('should test toDate field required validator', async () => {
    const toDate = component.filterForm.controls.toDate;
    expect(toDate.errors.DateError).not.toBeNull();
    toDate.setValue('1/10/2020');
    expect(toDate.errors).toBeNull();
  });

  it('should test whether toDate errors out with invalid input', async () => {
    const toDate = component.filterForm.controls.toDate;
    toDate.setValue('invalidDate');
    expect(toDate.errors.DateError).not.toBeNull();
  });

  it('should test whether fromDate errors out with invalid input', async () => {
    const fromDate = component.filterForm.controls.fromDate;
    fromDate.setValue('invalidDate');
    expect(fromDate.errors.DateError).not.toBeNull();
  });

  it('should test sender field max length validator', async () => {
    const sender = component.filterForm.controls.sender;
    sender.setValue('jfeghbrkfejgbrjtgrhtgjrehgjrehjkrehgjkrehkrejbhjkre');
    expect(sender.errors.maxLength).not.toBeNull();
    sender.setValue('test');
    expect(sender.errors).toBeNull();
  });

  it('should test sender field pattern validator', async () => {
    const sender = component.filterForm.controls.sender;
    sender.setValue('test$');
    expect(sender.errors.pattern).not.toBeNull();
    sender.setValue('test');
    expect(sender.errors).toBeNull();
  });

  it('should test form validity with valid inputs', async () => {
    expect(component.filterForm.valid).toBeFalsy();
    component.filterForm.controls.sender.setValue('test');
    component.filterForm.controls.fromDate.setValue('01/02/2019');
    component.filterForm.controls.toDate.setValue('01/08/2019');
    expect(component.filterForm.valid).toBeTruthy();
    expect(component.fromDate).toBe('01/02/2019');
    expect(component.sender).toBe('test');
    expect(component.toDate.getDate).toBe(new Date('01/08/2019').getDate);
  });

  it('should test submit()', async () => {
    component.submit();
    spyOn(component, 'getNotifications');
    spyOn(component, 'applyFilter');
    expect(component.getNotifications).not.toHaveBeenCalled();
    expect(component.applyFilter).not.toHaveBeenCalled();
    // submit() cannot be called until 'sender', 'fromDate' and 'toDate' are set
    component.filterForm.controls.sender.setValue('test');
    component.filterForm.controls.fromDate.setValue('01/02/2019');
    component.filterForm.controls.toDate.setValue('01/08/2019');
    expect(component.filterForm.valid).toBeTruthy();
    component.submit();
    expect(component.getNotifications).toHaveBeenCalled();
    expect(component.applyFilter).toHaveBeenCalled();
  });

  it('should test applyFilter()', async () => {
    expect(component.dataSource).toBeTruthy();
    expect(component.dataSource.filter).toEqual('');
    component.applyFilter();
    expect(component.dataSource.filter).toContain('randomValue');
  });

  it('should test addEvent() with in-range data', async () => {
    expect(component.dataSource).toBeTruthy();
    component.filterForm.controls.fromDate.setValue('01/02/2019');
    component.filterForm.controls.toDate.setValue('01/08/2019 ');
    let testNotification: Notification[];
    // created date is within fromDate and toDate range
    testNotification = [
      {
        created: '01/03/2019', modified: 2, id: 'test',
        slug: 'test', sender: 'user1', category: 'test',
        severity: 'test', content: 'test', status: 'test', labels: []}
    ];

    component.addEvent();
    expect(component.dataSource.filterPredicate(testNotification[0], null)).toBe(true);
  });

  it('should test addEvent() with not in range data', async () => {
    expect(component.dataSource).toBeTruthy();
    component.filterForm.controls.fromDate.setValue('01/02/2019');
    component.filterForm.controls.toDate.setValue('01/08/2019 ');
    let testNotification: Notification[];
    // created date is not within fromDate and toDate range
    testNotification = [
      {
        created: '01/09/2019', modified: 2, id: 'test',
        slug: 'test', sender: 'user1', category: 'test',
        severity: 'test', content: 'test', status: 'test', labels: []}
    ];

    component.addEvent();
    expect(component.dataSource.filterPredicate(testNotification[0], null)).toBe(false);
  });

  it('should test processNotifications()', async () => {

    let dummyNotification = [
      {
        created: 1579900780411,
        modified: 1579900780411,
        id: '47ac6ea1-050a-4826-9c53-f9878e353fe9',
        slug: 'device-change-1579900780410',
        sender: 'edgex-core-metadata',
        category: 'SW_HEALTH',
        severity: 'NORMAL',
        content: 'Device update: RSP-150000-POST',
        description: 'Metadata device notice',
        status: 'NEW',
        labels: ['test']
      }
    ];
    expect(component.dataSource.data.length).toBe(0);

    component.processNotifications(dummyNotification);
    expect(component.dataSource.data.length).toBe(1);
    const dataFields = Object.keys(component.dataSource.data[0]).length;
    expect(dataFields).toBe(11);
    expect(component.dataSource.data).not.toEqual(dummyNotification);

    dummyNotification = [];
    component.processNotifications(dummyNotification);
    expect(component.dataSource.data.length).toBe(0);
    expect(component.dataSource.data).toEqual(dummyNotification);
  });

  it('expects apiService to fetch notification data',
   inject([HttpTestingController, ApiService],
      (httpMock: HttpTestingController, service: ApiService) => {
        service.getNotifications('test', 10).subscribe(message => {
          expect(Object.keys(message).length).toBe(1);
          expect(message).toEqual(dummyNotifications);
        });
        // HttpClient mock
        const req = httpMock.expectOne('http://127.0.0.1:48060/api/v1/notification/sender/test/10');
        expect(req.request.method).toEqual('GET');
        // fake notification data to be returned by the mock
        const dummyNotifications = [
          {
            created: 1579900780411,
            modified: 1579900780411,
            id: '47ac6ea1-050a-4826-9c53-f9878e353fe9',
            slug: 'device-change-1579900780410',
            sender: 'edgex-core-metadata',
            category: 'SW_HEALTH',
            severity: 'NORMAL',
            content: 'Device update: RSP-150000-POST',
            description: 'Metadata device notice',
            status: 'NEW',
            labels: ['test']
          }
        ];
        req.flush(dummyNotifications);
    })
  );

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));


});
