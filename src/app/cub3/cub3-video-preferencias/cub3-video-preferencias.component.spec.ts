import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Cub3VideoPreferenciasComponent } from './cub3-video-preferencias.component';

describe('Cub3VideoPreferenciasComponent', () => {
  let component: Cub3VideoPreferenciasComponent;
  let fixture: ComponentFixture<Cub3VideoPreferenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cub3VideoPreferenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cub3VideoPreferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
