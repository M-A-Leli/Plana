import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetCodeVerificationComponent } from './reset-code-verification.component';

describe('ResetCodeVerificationComponent', () => {
  let component: ResetCodeVerificationComponent;
  let fixture: ComponentFixture<ResetCodeVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetCodeVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetCodeVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
