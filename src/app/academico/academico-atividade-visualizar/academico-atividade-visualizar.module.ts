import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MomentModule} from "ngx-moment";
import {Cub3Module} from "@cub3/cub3.module";

import { IonicModule } from '@ionic/angular';

import { AcademicoAtividadeVisualizarPageRoutingModule } from './academico-atividade-visualizar-routing.module';

import { AcademicoAtividadeVisualizarPage } from './academico-atividade-visualizar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Cub3Module,
    MomentModule,
    AcademicoAtividadeVisualizarPageRoutingModule
  ],
  declarations: [AcademicoAtividadeVisualizarPage]
})
export class AcademicoAtividadeVisualizarPageModule {}
