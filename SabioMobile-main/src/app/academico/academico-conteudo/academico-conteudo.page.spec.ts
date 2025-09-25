import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcademicoConteudoPage } from './academico-conteudo.page';

describe('AcademicoConteudoPage', () => {
  let component: AcademicoConteudoPage;
  let fixture: ComponentFixture<AcademicoConteudoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademicoConteudoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicoConteudoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
