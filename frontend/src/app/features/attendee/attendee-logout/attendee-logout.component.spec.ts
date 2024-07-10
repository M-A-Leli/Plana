import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeeLogoutComponent } from './attendee-logout.component';

describe('AttendeeLogoutComponent', () => {
  let component: AttendeeLogoutComponent;
  let fixture: ComponentFixture<AttendeeLogoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendeeLogoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendeeLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
