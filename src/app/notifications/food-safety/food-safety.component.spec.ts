/* Apache v2 license
*  Copyright (C) <2019> Intel Corporation
*
*  SPDX-License-Identifier: Apache-2.0
*/

// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {NotifsFoodSafetyComponent} from './food-safety.component';
import {ApiService} from '../../services/api.service';
import {DatePipe} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatTableModule} from '@angular/material';

@Injectable()
class MockApiService { }

describe('NotifsFoodSafetyComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NotifsFoodSafetyComponent
      ],
      imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatTableModule],
      providers: [
        {provide: ApiService, useClass: MockApiService},
        DatePipe,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
    fixture = TestBed.createComponent(NotifsFoodSafetyComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create a component', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    // const result = component.ngOnInit();
  });

  it('should run #ngOnDestroy()', async () => {
    // const result = component.ngOnDestroy();
  });

  it('should run #addEvent()', async () => {
    // const result = component.addEvent(event);
  });

  it('should run #getNotifications()', async () => {
    // const result = component.getNotifications();
  });

  it('should run #submit()', async () => {
    // const result = component.submit();
  });

  it('should run #applyFilter()', async () => {
    // const result = component.applyFilter();
  });

});
