import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicoAbasPage } from './academico-abas.page';

describe('AcademicoAbasPage', () => {
  let component: AcademicoAbasPage;
  let fixture: ComponentFixture<AcademicoAbasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AcademicoAbasPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademicoAbasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
