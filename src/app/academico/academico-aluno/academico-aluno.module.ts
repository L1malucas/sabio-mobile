import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoAlunoPageRoutingModule } from './academico-aluno-routing.module';

import { AcademicoAlunoPage } from './academico-aluno.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcademicoAlunoPageRoutingModule
  ],
  declarations: [AcademicoAlunoPage]
})
export class AcademicoAlunoPageModule {}
