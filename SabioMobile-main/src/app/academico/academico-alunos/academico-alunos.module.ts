import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoAlunosPageRoutingModule } from './academico-alunos-routing.module';

import { AcademicoAlunosPage } from './academico-alunos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcademicoAlunosPageRoutingModule
  ],
  declarations: [AcademicoAlunosPage]
})
export class AcademicoAlunosPageModule {}
