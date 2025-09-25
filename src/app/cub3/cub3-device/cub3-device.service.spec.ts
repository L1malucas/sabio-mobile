import { TestBed } from '@angular/core/testing';

import { Cub3DeviceService } from './cub3-device.service';

describe('Cub3DeviceService', () => {
  let service: Cub3DeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cub3DeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
