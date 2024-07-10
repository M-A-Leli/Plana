import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerLogoutComponent } from './organizer-logout.component';

describe('OrganizerLogoutComponent', () => {
  let component: OrganizerLogoutComponent;
  let fixture: ComponentFixture<OrganizerLogoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerLogoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
