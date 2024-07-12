import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleAttendeeComponent } from './single-attendee.component';

describe('SingleAttendeeComponent', () => {
  let component: SingleAttendeeComponent;
  let fixture: ComponentFixture<SingleAttendeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleAttendeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleAttendeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
