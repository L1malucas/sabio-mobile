import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcademicoAcompanhamentosPage } from './academico-acompanhamentos.page';

describe('AcademicoAcompanhamentosPage', () => {
  let component: AcademicoAcompanhamentosPage;
  let fixture: ComponentFixture<AcademicoAcompanhamentosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademicoAcompanhamentosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicoAcompanhamentosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
