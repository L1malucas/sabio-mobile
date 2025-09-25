import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcademicoAcompanhamentoPage } from './academico-acompanhamento.page';

describe('AcademicoAcompanhamentoPage', () => {
  let component: AcademicoAcompanhamentoPage;
  let fixture: ComponentFixture<AcademicoAcompanhamentoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademicoAcompanhamentoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicoAcompanhamentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
