import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcademicoAlunosPorTurmaPage } from './academico-alunos-por-turma.page';

describe('AcademicoAlunosPorTurmaPage', () => {
  let component: AcademicoAlunosPorTurmaPage;
  let fixture: ComponentFixture<AcademicoAlunosPorTurmaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademicoAlunosPorTurmaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicoAlunosPorTurmaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
