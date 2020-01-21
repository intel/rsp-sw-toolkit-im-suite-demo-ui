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

  it('should call submit method by clicking the submit button', async () => {
    spyOn(component, 'submit');
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);
    expect(component.submit).toHaveBeenCalled();
  });

  it('should test initial fromDate field validity', async () => {
    component.buildForm();
    const fromDate = component.filterForm.controls.fromDate;
    expect(fromDate.valid).toBeFalsy();
  });

  it('should test initial toDate field validity', async () => {
    component.buildForm();
    const toDate = component.filterForm.controls.toDate;
    expect(toDate.valid).toBeFalsy();
  });

  it('should test initial sender field validity', async () => {
    component.buildForm();
    const sender = component.filterForm.controls.sender;
    expect(sender.valid).toBeFalsy();
  });

  it('should test sender field required validator', async () => {
    component.buildForm();
    const sender = component.filterForm.controls.sender;
    expect(sender.errors.required).toBeTruthy();
  });

  it('should test fromDate field required validator', async () => {
    component.buildForm();
    const fromDate = component.filterForm.controls.fromDate;
    expect(fromDate.errors.DateError).toBeTruthy();
  });

  it('should test toDate field required validator', async () => {
    component.buildForm();
    const toDate = component.filterForm.controls.toDate;
    expect(toDate.errors.DateError).toBeTruthy();
  });

  it('should test toDate field required validator', async () => {
    component.buildForm();
    const toDate = component.filterForm.controls.toDate;
    expect(toDate.errors.DateError).toBeTruthy();
  });

  it('should test whether toDate errors out with invalid input', async () => {
    component.buildForm();
    const toDate = component.filterForm.controls.toDate;
    toDate.setValue('test')
    expect(toDate.errors.DateError).toBeTruthy();
  });

  it('should test whether fromDate errors out with invalid input', async () => {
    component.buildForm();
    const fromDate = component.filterForm.controls.fromDate;
    fromDate.setValue('test')
    expect(fromDate.errors.DateError).toBeTruthy();
  });

  it('should test sender field max length validator', async () => {
    component.buildForm();
    const sender = component.filterForm.controls.sender;
    sender.setValue('jfeghbrkfejgbrjtgrhtgjrehgjrehjkrehgjkrehkrejbhjkre')
    expect(sender.errors.maxLength).not.toBeNull();
    sender.setValue('test')
    expect(sender.errors).toBeNull();
  });

  it('should test sender field pattern validator', async () => {
    component.buildForm();
    const sender = component.filterForm.controls.sender;
    sender.setValue('test$')
    expect(sender.errors.pattern).not.toBeNull();
    sender.setValue('test')
    expect(sender.errors).toBeNull();
  });
});
