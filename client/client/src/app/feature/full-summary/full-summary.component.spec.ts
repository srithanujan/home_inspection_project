import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullSummaryComponent } from './full-summary.component';

describe('FullSummaryComponent', () => {
  let component: FullSummaryComponent;
  let fixture: ComponentFixture<FullSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
