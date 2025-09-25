import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MeusDadosRegistroJornadaPage } from './meus-dados-registro-jornada.page';

describe('MeusDadosRegistroJornadaPage', () => {
  let component: MeusDadosRegistroJornadaPage;
  let fixture: ComponentFixture<MeusDadosRegistroJornadaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeusDadosRegistroJornadaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MeusDadosRegistroJornadaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
