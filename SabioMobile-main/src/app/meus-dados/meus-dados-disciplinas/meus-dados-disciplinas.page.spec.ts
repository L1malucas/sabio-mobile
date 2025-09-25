import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MeusDadosDisciplinasPage } from './meus-dados-disciplinas.page';

describe('MeusDadosDisciplinasPage', () => {
  let component: MeusDadosDisciplinasPage;
  let fixture: ComponentFixture<MeusDadosDisciplinasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeusDadosDisciplinasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MeusDadosDisciplinasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
