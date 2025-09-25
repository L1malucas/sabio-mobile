import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcademicoOcorrenciaPage } from './academico-ocorrencia.page';

describe('AcademicoOcorrenciaPage', () => {
  let component: AcademicoOcorrenciaPage;
  let fixture: ComponentFixture<AcademicoOcorrenciaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademicoOcorrenciaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicoOcorrenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
