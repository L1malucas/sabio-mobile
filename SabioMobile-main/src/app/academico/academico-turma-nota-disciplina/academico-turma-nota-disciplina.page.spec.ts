import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcademicoTurmaNotaDisciplinaPage } from './academico-turma-nota-disciplina.page';

describe('AcademicoTurmaNotaDisciplinaPage', () => {
  let component: AcademicoTurmaNotaDisciplinaPage;
  let fixture: ComponentFixture<AcademicoTurmaNotaDisciplinaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademicoTurmaNotaDisciplinaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicoTurmaNotaDisciplinaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
