import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AcademicoAbasContainerComponentModule } from '../academico-abas-container/academico-abas-container.module';

import { AcademicoAba4Page } from './academico-aba4.page';

describe('AcademicoAba4Page', () => {
  let component: AcademicoAba4Page;
  let fixture: ComponentFixture<AcademicoAba4Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AcademicoAba4Page],
      imports: [IonicModule.forRoot(), AcademicoAbasContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicoAba4Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
