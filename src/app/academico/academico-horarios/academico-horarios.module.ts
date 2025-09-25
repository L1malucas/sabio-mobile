import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoHorariosPageRoutingModule } from './academico-horarios-routing.module';

import { AcademicoHorariosPage } from './academico-horarios.page';
import {Cub3Module} from '@cub3/cub3.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Cub3Module,
    AcademicoHorariosPageRoutingModule
  ],
  declarations: [AcademicoHorariosPage]
})
export class AcademicoHorariosPageModule {}
