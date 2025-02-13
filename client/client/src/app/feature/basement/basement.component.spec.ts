import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasementComponent } from './basement.component';

describe('BasementComponent', () => {
  let component: BasementComponent;
  let fixture: ComponentFixture<BasementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
