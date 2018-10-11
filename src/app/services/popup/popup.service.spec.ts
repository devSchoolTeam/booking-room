import { TestBed, inject } from '@angular/core/testing';

import { PopupService } from './popup.service';

describe('Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PopupService]
    });
  });

  it('should be created', inject([PopupService], (service: PopupService) => {
    expect(service).toBeTruthy();
  }));
});
