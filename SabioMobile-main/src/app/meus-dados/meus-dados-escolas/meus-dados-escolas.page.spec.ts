import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MeusDadosEscolasPage } from './meus-dados-escolas.page';

describe('MeusDadosEscolasPage', () => {
  let component: MeusDadosEscolasPage;
  let fixture: ComponentFixture<MeusDadosEscolasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeusDadosEscolasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MeusDadosEscolasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
