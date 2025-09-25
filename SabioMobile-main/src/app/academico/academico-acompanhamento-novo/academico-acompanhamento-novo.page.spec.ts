import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcademicoAcompanhamentoNovoPage } from './academico-acompanhamento-novo.page';

describe('AcademicoAcompanhamentoNovoPage', () => {
  let component: AcademicoAcompanhamentoNovoPage;
  let fixture: ComponentFixture<AcademicoAcompanhamentoNovoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademicoAcompanhamentoNovoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicoAcompanhamentoNovoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
