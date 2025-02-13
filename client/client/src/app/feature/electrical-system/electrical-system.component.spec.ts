import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricalSystemComponent } from './electrical-system.component';

describe('ElectricalSystemComponent', () => {
  let component: ElectricalSystemComponent;
  let fixture: ComponentFixture<ElectricalSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectricalSystemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectricalSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
