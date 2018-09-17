import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeCountingComponent } from './time-counting.component';

describe('TimeCountingComponent', () => {
  let component: TimeCountingComponent;
  let fixture: ComponentFixture<TimeCountingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeCountingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeCountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
