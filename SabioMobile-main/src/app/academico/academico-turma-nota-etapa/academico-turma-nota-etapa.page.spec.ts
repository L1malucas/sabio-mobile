import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcademicoTurmaNotaEtapaPage } from './academico-turma-nota-etapa.page';

describe('AcademicoTurmaNotaEtapaPage', () => {
  let component: AcademicoTurmaNotaEtapaPage;
  let fixture: ComponentFixture<AcademicoTurmaNotaEtapaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademicoTurmaNotaEtapaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicoTurmaNotaEtapaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
