import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerCreateEventComponent } from './organizer-create-event.component';

describe('OrganizerCreateEventComponent', () => {
  let component: OrganizerCreateEventComponent;
  let fixture: ComponentFixture<OrganizerCreateEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerCreateEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerCreateEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
