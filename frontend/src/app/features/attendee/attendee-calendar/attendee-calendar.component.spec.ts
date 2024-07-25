import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeeCalendarComponent } from './attendee-calendar.component';

describe('AttendeeCalendarComponent', () => {
  let component: AttendeeCalendarComponent;
  let fixture: ComponentFixture<AttendeeCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendeeCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendeeCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
