import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoTurmaNotaAlunosPageRoutingModule } from './academico-turma-nota-alunos-routing.module';

import { AcademicoTurmaNotaAlunosPage } from './academico-turma-nota-alunos.page';
import {Cub3Module} from '@cub3/cub3.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Cub3Module,
    AcademicoTurmaNotaAlunosPageRoutingModule
  ],
  declarations: [AcademicoTurmaNotaAlunosPage]
})
export class AcademicoTurmaNotaAlunosPageModule {}
