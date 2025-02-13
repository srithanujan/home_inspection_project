import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonAreaComponent } from './common-area.component';

describe('CommonAreaComponent', () => {
  let component: CommonAreaComponent;
  let fixture: ComponentFixture<CommonAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
