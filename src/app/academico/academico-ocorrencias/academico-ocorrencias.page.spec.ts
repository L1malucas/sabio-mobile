import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcademicoOcorrenciasPage } from './academico-ocorrencias.page';

describe('AcademicoOcorrenciasPage', () => {
  let component: AcademicoOcorrenciasPage;
  let fixture: ComponentFixture<AcademicoOcorrenciasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademicoOcorrenciasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicoOcorrenciasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
