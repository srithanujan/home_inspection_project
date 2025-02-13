import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlumbingComponent } from './plumbing.component';

describe('PlumbingComponent', () => {
  let component: PlumbingComponent;
  let fixture: ComponentFixture<PlumbingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlumbingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlumbingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
