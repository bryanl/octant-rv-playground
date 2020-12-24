import { TestBed } from '@angular/core/testing';

import { ResourceViewerService } from './resource-viewer.service';

describe('ResourceViewerService', () => {
  let service: ResourceViewerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceViewerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
