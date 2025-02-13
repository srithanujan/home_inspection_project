import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatingSystemComponent } from './heating-system.component';

describe('HeatingSystemComponent', () => {
  let component: HeatingSystemComponent;
  let fixture: ComponentFixture<HeatingSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeatingSystemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeatingSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
