import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcademicoAtividadeNovoPage } from './academico-atividade-novo.page';

describe('AcademicoAtividadeNovoPage', () => {
  let component: AcademicoAtividadeNovoPage;
  let fixture: ComponentFixture<AcademicoAtividadeNovoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademicoAtividadeNovoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicoAtividadeNovoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
