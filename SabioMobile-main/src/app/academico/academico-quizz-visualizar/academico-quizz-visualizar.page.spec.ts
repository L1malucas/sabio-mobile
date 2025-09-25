import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcademicoQuizzVisualizarPage } from './academico-quizz-visualizar.page';

describe('AcademicoQuizzVisualizarPage', () => {
  let component: AcademicoQuizzVisualizarPage;
  let fixture: ComponentFixture<AcademicoQuizzVisualizarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademicoQuizzVisualizarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicoQuizzVisualizarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
