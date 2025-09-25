import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoTurmaNotaAlunoPageRoutingModule } from './academico-turma-nota-aluno-routing.module';

import { AcademicoTurmaNotaAlunoPage } from './academico-turma-nota-aluno.page';
import {Cub3Module} from '@cub3/cub3.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Cub3Module,
    AcademicoTurmaNotaAlunoPageRoutingModule
  ],
  declarations: [AcademicoTurmaNotaAlunoPage]
})
export class AcademicoTurmaNotaAlunoPageModule {}
