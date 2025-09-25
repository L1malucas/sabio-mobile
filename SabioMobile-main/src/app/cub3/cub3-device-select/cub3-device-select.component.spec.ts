import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Cub3DeviceSelectComponent } from './cub3-device-select.component';

describe('Cub3DeviceSelectComponent', () => {
  let component: Cub3DeviceSelectComponent;
  let fixture: ComponentFixture<Cub3DeviceSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cub3DeviceSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cub3DeviceSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
