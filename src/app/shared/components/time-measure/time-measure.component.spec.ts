import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeMeasureComponent } from './time-measure.component';

describe('TimeMeasureComponent', () => {
  let component: TimeMeasureComponent;
  let fixture: ComponentFixture<TimeMeasureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeMeasureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeMeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
