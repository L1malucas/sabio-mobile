import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoTurmaNotaDisciplinaPageRoutingModule } from './academico-turma-nota-disciplina-routing.module';

import { AcademicoTurmaNotaDisciplinaPage } from './academico-turma-nota-disciplina.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcademicoTurmaNotaDisciplinaPageRoutingModule
  ],
  declarations: [AcademicoTurmaNotaDisciplinaPage]
})
export class AcademicoTurmaNotaDisciplinaPageModule {}
