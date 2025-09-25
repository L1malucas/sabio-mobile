import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoFrequenciaPageRoutingModule } from './academico-frequencia-routing.module';

import { AcademicoFrequenciaPage } from './academico-frequencia.page';
import {Cub3Module} from '@cub3/cub3.module';
import {MomentModule} from "ngx-moment";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MomentModule,
    IonicModule,
    Cub3Module,
    AcademicoFrequenciaPageRoutingModule
  ],
  declarations: [AcademicoFrequenciaPage]
})
export class AcademicoFrequenciaPageModule {}
