import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoofComponent } from './roof.component';

describe('RoofComponent', () => {
  let component: RoofComponent;
  let fixture: ComponentFixture<RoofComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoofComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoofComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
