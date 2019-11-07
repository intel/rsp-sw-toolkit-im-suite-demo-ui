// tslint:disable
import { TestBed } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, Injectable} from '@angular/core';
import {TemperatureComponent} from './temperature.component';
import {ApiService} from 'chartjs-plugin-annotation';
import {ChartsModule} from 'ng2-charts';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {AppConfigService} from '../services/app-config-service';

@Injectable()
class MockApiService { }

describe('TemperatureComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TemperatureComponent
      ],
      imports: [ChartsModule, HttpClientTestingModule],
      providers: [
        { provide: ApiService, useClass: MockApiService},
        HttpClient,
        AppConfigService
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
    fixture = TestBed.createComponent(TemperatureComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create a component', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    // const result = component.ngOnInit();
  });

  it('should run #getRealTimeData()', async () => {
    // const result = component.getRealTimeData(tempCommand);
  });

  it('should run #timestampToDate()', async () => {
    // const result = component.timestampToDate(date);
  });

});
