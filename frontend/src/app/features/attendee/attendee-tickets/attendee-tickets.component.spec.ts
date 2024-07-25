import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeeTicketsComponent } from './attendee-tickets.component';

describe('AttendeeTicketsComponent', () => {
  let component: AttendeeTicketsComponent;
  let fixture: ComponentFixture<AttendeeTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendeeTicketsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendeeTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
