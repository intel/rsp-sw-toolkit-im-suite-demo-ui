/* Apache v2 license
*  Copyright (C) <2019> Intel Corporation
*
*  SPDX-License-Identifier: Apache-2.0
*/

import {async, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Injectable} from '@angular/core';
import {NotifyFoodSafetyComponent} from './food-safety.component';
import {ApiService} from '../../services/api.service';
import {DatePipe} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatTableModule} from '@angular/material';
import {By} from '@angular/platform-browser';

@Injectable()
class MockApiService {
  myTempCommandsEventEmitter: EventEmitter<any[]> = new EventEmitter<any[]>();
}

describe('NotifyFoodSafetyComponent', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NotifyFoodSafetyComponent
      ],
      imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatTableModule],
      providers: [
        {provide: ApiService, useClass: MockApiService},
        DatePipe,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(NotifyFoodSafetyComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  }));

  it('should create a component', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #addEvent()', async () => {
    // const result = component.addEvent(event);
  });

  it('should call submit method by clicking the submit button', async () => {
    spyOn(component, 'submit');
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);
    expect(component.submit).toHaveBeenCalled();
    expect(component.filterForm).toBeTruthy();
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
    expect(sender.errors.required).toBeTruthy();
  });

  it('should test fromDate field required validator', async () => {
    const fromDate = component.filterForm.controls.fromDate;
    expect(fromDate.errors.DateError).toBeTruthy();
  });

  it('should test toDate field required validator', async () => {
    const toDate = component.filterForm.controls.toDate;
    expect(toDate.errors.DateError).toBeTruthy();
  });

  it('should test toDate field required validator', async () => {
    const toDate = component.filterForm.controls.toDate;
    expect(toDate.errors.DateError).toBeTruthy();
  });

  it('should test whether toDate errors out with invalid input', async () => {
    const toDate = component.filterForm.controls.toDate;
    toDate.setValue('test');
    expect(toDate.errors.DateError).toBeTruthy();
  });

  it('should test whether fromDate errors out with invalid input', async () => {
    const fromDate = component.filterForm.controls.fromDate;
    fromDate.setValue('test');
    expect(fromDate.errors.DateError).toBeTruthy();
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

  it('should test toDate()', async () => {
    const toDateToTest = '01/08/2019';
    component.filterForm.controls.sender.setValue('test');
    component.filterForm.controls.fromDate.setValue('01/02/2019');
    component.filterForm.controls.toDate.setValue(toDateToTest);
    // should not match exactly as extra hours are added to match the end of day in the toDate()
    expect(component.toDate.fromDate).not.toBe(new Date('01/08/2019'));
    // should match if just date or day is compared instead of exact full date matching
    expect(component.toDate.getDate).toBe(new Date(toDateToTest).getDate);
  });

  it('should test submit()', async () => {
    component.submit();
    spyOn(component, 'getNotifications');
    spyOn(component, 'applyFilter');
    expect(component.getNotifications).not.toHaveBeenCalled();
    expect(component.applyFilter).not.toHaveBeenCalled();
    component.filterForm.controls.sender.setValue('test');
    component.filterForm.controls.fromDate.setValue('01/02/2019');
    component.filterForm.controls.toDate.setValue('01/08/2019');
    expect(component.filterForm.valid).toBeTruthy();
    component.submit();
    // should be called as form is valid now
    expect(component.getNotifications).toHaveBeenCalled();
    expect(component.applyFilter).toHaveBeenCalled();
    expect(component.dataSource.paginator).toBeFalsy();
  });

  it('should test applyFilter()', async () => {
    expect(component.dataSource).toBeTruthy();
    expect(component.dataSource.filter).toEqual('');
    component.applyFilter();
    expect(component.dataSource.filter).toContain('randomValue');
  });

  /*it('should test addEvent()', async () => {
    expect(component.dataSource).toBeTruthy();

    /!*component.filterForm.controls.fromDate.setValue('01/02/2019');
    component.filterForm.controls.toDate.setValue('01/08/2019');*!/

    let testNotifications: Notification[];
    testNotifications = [
      {
        created: '01-01-2020', modified: 2, id: 'test',
        slug: 'test', sender: 'admin', category: 'test',
        severity: 'test', content: 'test', status: 'test', labels: []}
    ];
    component.data = testNotifications;
    console.log(component.dataSource.filterPredicate);
    const result = component.addEvent(0);
    console.log(result);
  });*/
});
