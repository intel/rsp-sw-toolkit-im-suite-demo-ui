// tslint:disable
import { TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {RFIDInventoryComponent} from './rfid-inventory.component';
import {ApiService} from '../services/api.service';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatTableModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AppConfigService} from "../services/app-config-service";

@Injectable()
class MockApiService { }

describe('RFIDInventoryComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        RFIDInventoryComponent
      ],
      imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatTableModule,
        FlexLayoutModule, HttpClientTestingModule ],
      providers: [
        { provide: ApiService, useClass: MockApiService},
        AppConfigService,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
    fixture = TestBed.createComponent(RFIDInventoryComponent);
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

  it('should run #getAliases()', async () => {
    // const result = component.getAliases();
  });

  it('should run #getTagInfo()', async () => {
    // const result = component.getTagInfo(tagInfo);
  });

  it('should run #isCurrentLocation()', async () => {
    // const result = component.isCurrentLocation(sensorId);
  });

  it('should run #clickedInfo()', async () => {
    // const result = component.clickedInfo();
  });

  it('should run #expandedOrCollapsed()', async () => {
    // const result = component.expandedOrCollapsed(element);
  });

  it('should run #applyFilter()', async () => {
    // const result = component.applyFilter(filterValue);
  });

});
