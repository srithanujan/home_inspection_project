import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GarageCarportComponent } from './garage-carport.component';

describe('GarageCarportComponent', () => {
  let component: GarageCarportComponent;
  let fixture: ComponentFixture<GarageCarportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GarageCarportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GarageCarportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
