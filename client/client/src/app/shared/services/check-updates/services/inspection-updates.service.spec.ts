import { TestBed } from '@angular/core/testing';

import { InspectionUpdatesService } from './inspection-updates.service';

describe('InspectionUpdatesService', () => {
  let service: InspectionUpdatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InspectionUpdatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
