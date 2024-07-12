import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAttendeeComponent } from './create-attendee.component';

describe('CreateAttendeeComponent', () => {
  let component: CreateAttendeeComponent;
  let fixture: ComponentFixture<CreateAttendeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAttendeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAttendeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
