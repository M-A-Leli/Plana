import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAttendeeComponent } from './delete-attendee.component';

describe('DeleteAttendeeComponent', () => {
  let component: DeleteAttendeeComponent;
  let fixture: ComponentFixture<DeleteAttendeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAttendeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteAttendeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
