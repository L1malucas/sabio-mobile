import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Cub3CameraComponent } from './cub3-camera.component';

describe('Cub3CameraComponent', () => {
  let component: Cub3CameraComponent;
  let fixture: ComponentFixture<Cub3CameraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cub3CameraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cub3CameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
