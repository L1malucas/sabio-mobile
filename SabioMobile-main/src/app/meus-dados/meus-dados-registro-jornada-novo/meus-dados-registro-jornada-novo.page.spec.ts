import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MeusDadosRegistroJornadaNovoPage } from './meus-dados-registro-jornada-novo.page';

describe('MeusDadosRegistroJornadaNovoPage', () => {
  let component: MeusDadosRegistroJornadaNovoPage;
  let fixture: ComponentFixture<MeusDadosRegistroJornadaNovoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeusDadosRegistroJornadaNovoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MeusDadosRegistroJornadaNovoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
