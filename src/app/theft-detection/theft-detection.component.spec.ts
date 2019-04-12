import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheftDetectionComponent } from './theft-detection.component';

describe('TheftDetectionComponent', () => {
  let component: TheftDetectionComponent;
  let fixture: ComponentFixture<TheftDetectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheftDetectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheftDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
