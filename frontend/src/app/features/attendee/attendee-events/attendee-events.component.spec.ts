import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeeEventsComponent } from './attendee-events.component';

describe('AttendeeEventsComponent', () => {
  let component: AttendeeEventsComponent;
  let fixture: ComponentFixture<AttendeeEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendeeEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendeeEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
