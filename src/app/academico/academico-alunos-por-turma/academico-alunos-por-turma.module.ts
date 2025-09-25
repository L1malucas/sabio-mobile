import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoAlunosPorTurmaPageRoutingModule } from './academico-alunos-por-turma-routing.module';

import { AcademicoAlunosPorTurmaPage } from './academico-alunos-por-turma.page';
import {Cub3Module} from '@cub3/cub3.module';
import { MomentModule } from 'ngx-moment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MomentModule,
    IonicModule,
    Cub3Module,
    AcademicoAlunosPorTurmaPageRoutingModule
  ],
  declarations: [AcademicoAlunosPorTurmaPage]
})
export class AcademicoAlunosPorTurmaPageModule {}
