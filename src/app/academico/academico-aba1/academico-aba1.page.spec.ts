import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AcademicoAbasContainerComponentModule } from '../academico-abas-container/academico-abas-container.module';

import { AcademicoAba1Page } from './academico-aba1.page';

describe('AcademicoAba1Page', () => {
  let component: AcademicoAba1Page;
  let fixture: ComponentFixture<AcademicoAba1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AcademicoAba1Page],
      imports: [IonicModule.forRoot(), AcademicoAbasContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicoAba1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
