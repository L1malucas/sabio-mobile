import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoAcompanhamentoPageRoutingModule } from './academico-acompanhamento-routing.module';

import { AcademicoAcompanhamentoPage } from './academico-acompanhamento.page';
import { Cub3Module } from '@cub3/cub3.module';
import { MomentModule } from 'ngx-moment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Cub3Module,
    MomentModule,
    AcademicoAcompanhamentoPageRoutingModule
  ],
  declarations: [AcademicoAcompanhamentoPage]
})
export class AcademicoAcompanhamentoPageModule {}
