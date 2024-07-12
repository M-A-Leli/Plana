import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleAdminComponent } from './single-admin.component';

describe('SingleAdminComponent', () => {
  let component: SingleAdminComponent;
  let fixture: ComponentFixture<SingleAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
