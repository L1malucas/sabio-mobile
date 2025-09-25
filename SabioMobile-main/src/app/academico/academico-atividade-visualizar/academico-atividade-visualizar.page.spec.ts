import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcademicoAtividadeVisualizarPage } from './academico-atividade-visualizar.page';

describe('AcademicoAtividadeVisualizarPage', () => {
  let component: AcademicoAtividadeVisualizarPage;
  let fixture: ComponentFixture<AcademicoAtividadeVisualizarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademicoAtividadeVisualizarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicoAtividadeVisualizarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
