import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MeusDadosFrequenciaPage } from './meus-dados-frequencia.page';

describe('MeusDadosFrequenciaPage', () => {
  let component: MeusDadosFrequenciaPage;
  let fixture: ComponentFixture<MeusDadosFrequenciaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeusDadosFrequenciaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MeusDadosFrequenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
