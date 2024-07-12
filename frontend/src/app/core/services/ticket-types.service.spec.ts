import { TestBed } from '@angular/core/testing';

import { TicketTypesService } from './ticket-types.service';

describe('TicketTypesService', () => {
  let service: TicketTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
