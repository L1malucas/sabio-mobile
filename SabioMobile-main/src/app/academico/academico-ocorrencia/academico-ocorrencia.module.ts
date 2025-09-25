import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoOcorrenciaPageRoutingModule } from './academico-ocorrencia-routing.module';

import { AcademicoOcorrenciaPage } from './academico-ocorrencia.page';
import {Cub3Module} from '@cub3/cub3.module';
import {MomentModule} from "ngx-moment";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Cub3Module,
    MomentModule,
    AcademicoOcorrenciaPageRoutingModule
  ],
  declarations: [AcademicoOcorrenciaPage]
})
export class AcademicoOcorrenciaPageModule {}
