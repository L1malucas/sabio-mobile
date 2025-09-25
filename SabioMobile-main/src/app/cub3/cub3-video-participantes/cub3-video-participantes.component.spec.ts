import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Cub3VideoParticipantesComponent } from './cub3-video-participantes.component';

describe('Cub3VideoParticipantesComponent', () => {
  let component: Cub3VideoParticipantesComponent;
  let fixture: ComponentFixture<Cub3VideoParticipantesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cub3VideoParticipantesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cub3VideoParticipantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
