import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeeMessagesComponent } from './attendee-messages.component';

describe('AttendeeMessagesComponent', () => {
  let component: AttendeeMessagesComponent;
  let fixture: ComponentFixture<AttendeeMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendeeMessagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendeeMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
