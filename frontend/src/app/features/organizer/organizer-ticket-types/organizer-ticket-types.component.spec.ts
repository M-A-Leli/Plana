import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerTicketTypesComponent } from './organizer-ticket-types.component';

describe('OrganizerTicketTypesComponent', () => {
  let component: OrganizerTicketTypesComponent;
  let fixture: ComponentFixture<OrganizerTicketTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerTicketTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerTicketTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
