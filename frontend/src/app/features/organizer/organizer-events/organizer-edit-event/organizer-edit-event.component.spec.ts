import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerEditEventComponent } from './organizer-edit-event.component';

describe('OrganizerEditEventComponent', () => {
  let component: OrganizerEditEventComponent;
  let fixture: ComponentFixture<OrganizerEditEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerEditEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerEditEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
