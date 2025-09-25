import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoAvaliacaoVisualizarPageRoutingModule } from './academico-avaliacao-visualizar-routing.module';

import { AcademicoAvaliacaoVisualizarPage } from './academico-avaliacao-visualizar.page';
import {Cub3Module} from '@cub3/cub3.module';
import {MomentModule} from "ngx-moment";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MomentModule,
    Cub3Module,
    IonicModule,
    AcademicoAvaliacaoVisualizarPageRoutingModule
  ],
  declarations: [AcademicoAvaliacaoVisualizarPage]
})
export class AcademicoAvaliacaoVisualizarPageModule {}
