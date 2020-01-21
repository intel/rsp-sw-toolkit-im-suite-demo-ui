/* Apache v2 license
*  Copyright (C) <2019> Intel Corporation
*
*  SPDX-License-Identifier: Apache-2.0
*/

import { TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {NotifyFoodSafetyComponent} from './food-safety.component';
import {ApiService} from '../../services/api.service';
import {DatePipe} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatTableModule} from '@angular/material';
import {By} from '@angular/platform-browser';

@Injectable()
class MockApiService { }

describe('NotifyFoodSafetyComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NotifyFoodSafetyComponent
      ],
      imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatTableModule],
      providers: [
        {provide: ApiService, useClass: MockApiService},
        DatePipe,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
    fixture = TestBed.createComponent(NotifyFoodSafetyComponent);
    component = fixture.componentInstance;
  });

  it('should create a component', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #addEvent()', async () => {
    // const result = component.addEvent(event);
  });

  it('should run #getNotifications()', async () => {
    // const result = component.getNotifications();
  });

  it('should call submit method', async () => {
    spyOn(component, 'submit');
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);
    expect(component.submit).toHaveBeenCalled();
  });

  it('from date field validity', async () => {
    component.buildForm();
    const fromDate = component.filterForm.controls.fromDate;
    expect(fromDate.valid).toBeFalsy();
  });

  it('to date field validity', async () => {
    component.buildForm();
    const toDate = component.filterForm.controls.toDate;
    expect(toDate.valid).toBeFalsy();
  });

  it('should run #applyFilter()', async () => {
    // const result = component.applyFilter();
  });

});
