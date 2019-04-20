import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BleComponent } from './ble.component';

describe('BleComponent', () => {
  let component: BleComponent;
  let fixture: ComponentFixture<BleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
