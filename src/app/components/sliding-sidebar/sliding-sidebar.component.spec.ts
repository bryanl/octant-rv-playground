import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidingSidebarComponent } from './sliding-sidebar.component';

describe('SlidingSidebarComponent', () => {
  let component: SlidingSidebarComponent;
  let fixture: ComponentFixture<SlidingSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlidingSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidingSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
