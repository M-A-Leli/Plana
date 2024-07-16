import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerSingleEventComponent } from './organizer-single-event.component';

describe('OrganizerSingleEventComponent', () => {
  let component: OrganizerSingleEventComponent;
  let fixture: ComponentFixture<OrganizerSingleEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerSingleEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerSingleEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
