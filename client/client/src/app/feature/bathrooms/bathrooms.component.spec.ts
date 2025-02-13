import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BathroomsComponent } from './bathrooms.component';

describe('BathroomsComponent', () => {
  let component: BathroomsComponent;
  let fixture: ComponentFixture<BathroomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BathroomsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BathroomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
