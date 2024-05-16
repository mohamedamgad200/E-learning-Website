import { TestBed } from '@angular/core/testing';

import { AssignmentService } from './assignment-service.service';

describe('AssignmentServiceService', () => {
  let service: AssignmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
