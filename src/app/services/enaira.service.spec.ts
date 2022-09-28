import { TestBed } from '@angular/core/testing';

import { EnairaService } from './enaira.service';

describe('EnairaService', () => {
  let service: EnairaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnairaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
