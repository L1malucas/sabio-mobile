import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcademicoAvaliacaoVisualizarPage } from './academico-avaliacao-visualizar.page';

describe('AcademicoAvaliacaoVisualizarPage', () => {
  let component: AcademicoAvaliacaoVisualizarPage;
  let fixture: ComponentFixture<AcademicoAvaliacaoVisualizarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademicoAvaliacaoVisualizarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicoAvaliacaoVisualizarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
