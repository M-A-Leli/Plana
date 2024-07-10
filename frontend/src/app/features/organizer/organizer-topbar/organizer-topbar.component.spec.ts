import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerTopbarComponent } from './organizer-topbar.component';

describe('OrganizerTopbarComponent', () => {
  let component: OrganizerTopbarComponent;
  let fixture: ComponentFixture<OrganizerTopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerTopbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
