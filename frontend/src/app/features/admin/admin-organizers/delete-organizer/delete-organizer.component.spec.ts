import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteOrganizerComponent } from './delete-organizer.component';

describe('DeleteOrganizerComponent', () => {
  let component: DeleteOrganizerComponent;
  let fixture: ComponentFixture<DeleteOrganizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteOrganizerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteOrganizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
