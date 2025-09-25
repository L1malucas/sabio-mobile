import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcademicoTurmaNotaAlunoPage } from './academico-turma-nota-aluno.page';

describe('AcademicoTurmaNotaAlunoPage', () => {
  let component: AcademicoTurmaNotaAlunoPage;
  let fixture: ComponentFixture<AcademicoTurmaNotaAlunoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademicoTurmaNotaAlunoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicoTurmaNotaAlunoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
