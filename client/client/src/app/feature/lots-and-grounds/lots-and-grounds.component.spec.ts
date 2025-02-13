import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotsAndGroundsComponent } from './lots-and-grounds.component';

describe('LotsAndGroundsComponent', () => {
  let component: LotsAndGroundsComponent;
  let fixture: ComponentFixture<LotsAndGroundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LotsAndGroundsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LotsAndGroundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
