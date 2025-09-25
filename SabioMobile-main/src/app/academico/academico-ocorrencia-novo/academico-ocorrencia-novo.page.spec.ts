import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcademicoOcorrenciaNovoPage } from './academico-ocorrencia-novo.page';

describe('AcademicoOcorrenciaNovoPage', () => {
  let component: AcademicoOcorrenciaNovoPage;
  let fixture: ComponentFixture<AcademicoOcorrenciaNovoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademicoOcorrenciaNovoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicoOcorrenciaNovoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
