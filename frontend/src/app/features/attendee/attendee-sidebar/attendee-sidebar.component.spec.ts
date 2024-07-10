import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeeSidebarComponent } from './attendee-sidebar.component';

describe('AttendeeSidebarComponent', () => {
  let component: AttendeeSidebarComponent;
  let fixture: ComponentFixture<AttendeeSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendeeSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendeeSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
