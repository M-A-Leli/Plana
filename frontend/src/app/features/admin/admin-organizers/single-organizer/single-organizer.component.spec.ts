import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleOrganizerComponent } from './single-organizer.component';

describe('SingleOrganizerComponent', () => {
  let component: SingleOrganizerComponent;
  let fixture: ComponentFixture<SingleOrganizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleOrganizerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleOrganizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
