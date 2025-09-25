import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SincronizacaoPage } from './sincronizacao.page';

describe('SincronizacaoPage', () => {
  let component: SincronizacaoPage;
  let fixture: ComponentFixture<SincronizacaoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SincronizacaoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SincronizacaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
