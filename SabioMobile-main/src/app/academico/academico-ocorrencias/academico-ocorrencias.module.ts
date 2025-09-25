import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoOcorrenciasPageRoutingModule } from './academico-ocorrencias-routing.module';

import { AcademicoOcorrenciasPage } from './academico-ocorrencias.page';
import {Cub3Module} from '@cub3/cub3.module';
import {MomentModule} from "ngx-moment";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Cub3Module,
    MomentModule,
    IonicModule,
    AcademicoOcorrenciasPageRoutingModule
  ],
  declarations: [AcademicoOcorrenciasPage]
})
export class AcademicoOcorrenciasPageModule {}
