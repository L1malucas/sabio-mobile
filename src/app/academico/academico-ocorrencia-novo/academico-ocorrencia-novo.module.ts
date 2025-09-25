import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoOcorrenciaNovoPageRoutingModule } from './academico-ocorrencia-novo-routing.module';

import { AcademicoOcorrenciaNovoPage } from './academico-ocorrencia-novo.page';
import {Cub3Module} from '@cub3/cub3.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Cub3Module,
    IonicModule,
    AcademicoOcorrenciaNovoPageRoutingModule
  ],
  declarations: [AcademicoOcorrenciaNovoPage]
})
export class AcademicoOcorrenciaNovoPageModule {}
