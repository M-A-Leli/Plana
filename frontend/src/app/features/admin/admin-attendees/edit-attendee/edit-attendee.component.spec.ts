import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAttendeeComponent } from './edit-attendee.component';

describe('EditAttendeeComponent', () => {
  let component: EditAttendeeComponent;
  let fixture: ComponentFixture<EditAttendeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAttendeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAttendeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
