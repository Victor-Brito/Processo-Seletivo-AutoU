import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailProcessorComponent } from './email-processor.component';

describe('EmailProcessorComponent', () => {
  let component: EmailProcessorComponent;
  let fixture: ComponentFixture<EmailProcessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailProcessorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailProcessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
