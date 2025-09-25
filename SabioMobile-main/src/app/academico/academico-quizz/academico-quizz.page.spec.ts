import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcademicoQuizzPage } from './academico-quizz.page';

describe('AcademicoQuizzPage', () => {
  let component: AcademicoQuizzPage;
  let fixture: ComponentFixture<AcademicoQuizzPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademicoQuizzPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicoQuizzPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
