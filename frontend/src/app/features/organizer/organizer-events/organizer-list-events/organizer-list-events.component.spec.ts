import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerListEventsComponent } from './organizer-list-events.component';

describe('OrganizerListEventsComponent', () => {
  let component: OrganizerListEventsComponent;
  let fixture: ComponentFixture<OrganizerListEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerListEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerListEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
