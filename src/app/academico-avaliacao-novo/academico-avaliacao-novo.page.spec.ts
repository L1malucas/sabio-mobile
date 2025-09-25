import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcademicoAvaliacaoNovoPage } from './academico-avaliacao-novo.page';

describe('AcademicoAvaliacaoNovoPage', () => {
  let component: AcademicoAvaliacaoNovoPage;
  let fixture: ComponentFixture<AcademicoAvaliacaoNovoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademicoAvaliacaoNovoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicoAvaliacaoNovoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
