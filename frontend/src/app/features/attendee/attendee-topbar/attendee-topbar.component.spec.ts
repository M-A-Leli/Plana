import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeeTopbarComponent } from './attendee-topbar.component';

describe('AttendeeTopbarComponent', () => {
  let component: AttendeeTopbarComponent;
  let fixture: ComponentFixture<AttendeeTopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendeeTopbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendeeTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
