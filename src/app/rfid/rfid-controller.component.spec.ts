import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RFIDInventoryComponent } from './rfid-controller.component';

describe('RFIDInventoryComponent', () => {
  let component: RFIDInventoryComponent;
  let fixture: ComponentFixture<RFIDInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RFIDInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RFIDInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
