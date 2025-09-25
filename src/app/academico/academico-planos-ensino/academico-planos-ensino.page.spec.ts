import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcademicoPlanosEnsinoPage } from './academico-planos-ensino.page';

describe('AcademicoPlanosEnsinoPage', () => {
  let component: AcademicoPlanosEnsinoPage;
  let fixture: ComponentFixture<AcademicoPlanosEnsinoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademicoPlanosEnsinoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicoPlanosEnsinoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
