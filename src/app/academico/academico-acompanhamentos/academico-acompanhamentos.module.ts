import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoAcompanhamentosPageRoutingModule } from './academico-acompanhamentos-routing.module';

import { AcademicoAcompanhamentosPage } from './academico-acompanhamentos.page';

import {Cub3Module} from '@cub3/cub3.module';
import {MomentModule} from "ngx-moment";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Cub3Module,
    MomentModule,
    AcademicoAcompanhamentosPageRoutingModule
  ],
  declarations: [AcademicoAcompanhamentosPage]
})
export class AcademicoAcompanhamentosPageModule {}
