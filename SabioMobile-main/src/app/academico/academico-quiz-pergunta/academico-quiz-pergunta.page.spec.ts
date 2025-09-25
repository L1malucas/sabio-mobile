import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcademicoQuizPerguntaPage } from './academico-quiz-pergunta.page';

describe('AcademicoQuizPerguntaPage', () => {
  let component: AcademicoQuizPerguntaPage;
  let fixture: ComponentFixture<AcademicoQuizPerguntaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademicoQuizPerguntaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicoQuizPerguntaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
