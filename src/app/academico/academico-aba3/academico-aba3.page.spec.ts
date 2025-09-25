import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AcademicoAbasContainerComponentModule } from '../academico-abas-container/academico-abas-container.module';

import { AcademicoAba3Page } from './academico-aba3.page';

describe('AcademicoAba3Page', () => {
  let component: AcademicoAba3Page;
  let fixture: ComponentFixture<AcademicoAba3Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AcademicoAba3Page],
      imports: [IonicModule.forRoot(), AcademicoAbasContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicoAba3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
