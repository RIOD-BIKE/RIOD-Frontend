import { TestBed } from '@angular/core/testing';

import { StatusAudioService } from './status-audio.service';

describe('StatusAudioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StatusAudioService = TestBed.get(StatusAudioService);
    expect(service).toBeTruthy();
  });
});
