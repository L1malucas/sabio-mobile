import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebcamModalComponent } from './webcam-modal.component';

describe('WebcamModalComponent', () => {
  let component: WebcamModalComponent;
  let fixture: ComponentFixture<WebcamModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebcamModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebcamModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
