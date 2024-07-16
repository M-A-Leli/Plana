import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerDeleteEventComponent } from './organizer-delete-event.component';

describe('OrganizerDeleteEventComponent', () => {
  let component: OrganizerDeleteEventComponent;
  let fixture: ComponentFixture<OrganizerDeleteEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerDeleteEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerDeleteEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
