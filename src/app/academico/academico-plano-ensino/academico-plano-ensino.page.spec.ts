import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcademicoPlanoensinoPage } from './academico-plano-ensino.page';

describe('AcademicoPlanoEnsinoPage', () => {
  let component: AcademicoPlanoensinoPage;
  let fixture: ComponentFixture<AcademicoPlanoensinoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademicoPlanoensinoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicoPlanoensinoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
