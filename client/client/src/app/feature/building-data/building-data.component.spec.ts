import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingDataComponent } from './building-data.component';

describe('BuildingDataComponent', () => {
  let component: BuildingDataComponent;
  let fixture: ComponentFixture<BuildingDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildingDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
