import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveAppBarComponent } from './responsive-app-bar.component';

describe('ResponsiveAppBarComponent', () => {
  let component: ResponsiveAppBarComponent;
  let fixture: ComponentFixture<ResponsiveAppBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponsiveAppBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponsiveAppBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
