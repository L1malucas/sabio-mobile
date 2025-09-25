import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AcademicoAbasContainerComponentModule } from '../academico-abas-container/academico-abas-container.module';

import { AcademicoAba2Page } from './academico-aba2.page';

describe('AcademicoAba2Page', () => {
  let component: AcademicoAba2Page;
  let fixture: ComponentFixture<AcademicoAba2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AcademicoAba2Page],
      imports: [IonicModule.forRoot(), AcademicoAbasContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicoAba2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
