// tslint:disable
import { TestBed } from '@angular/core/testing';
import {Injectable, NO_ERRORS_SCHEMA} from '@angular/core';

import {RFIDControllerComponent} from './rfid-controller.component';
import {ApiService} from '../services/api.service';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatTableModule} from '@angular/material';
import {HttpClientTestingModule} from '@angular/common/http/testing';

@Injectable()
class MockApiService { }

describe('RFIDControllerComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({

      declarations: [
        RFIDControllerComponent
      ],
      imports: [ReactiveFormsModule, HttpClientTestingModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatTableModule],
      providers: [
        {provide: ApiService, useClass: MockApiService},
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
    fixture = TestBed.createComponent(RFIDControllerComponent);
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

  it('should run #getCommands()', async () => {
    // const result = component.getCommands();
  });

  it('should run #getCommandResponse()', async () => {
    // const result = component.getCommandResponse(command);
  });

});
