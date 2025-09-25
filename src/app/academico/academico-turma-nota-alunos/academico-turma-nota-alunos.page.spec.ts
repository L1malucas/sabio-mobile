import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcademicoTurmaNotaAlunosPage } from './academico-turma-nota-alunos.page';

describe('AcademicoTurmaNotaAlunosPage', () => {
  let component: AcademicoTurmaNotaAlunosPage;
  let fixture: ComponentFixture<AcademicoTurmaNotaAlunosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademicoTurmaNotaAlunosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicoTurmaNotaAlunosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
