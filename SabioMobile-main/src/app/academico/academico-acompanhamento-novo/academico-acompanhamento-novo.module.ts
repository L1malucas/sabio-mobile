import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoAcompanhamentoNovoPageRoutingModule } from './academico-acompanhamento-novo-routing.module';

import { AcademicoAcompanhamentoNovoPage } from './academico-acompanhamento-novo.page';
import { Cub3Module } from '@cub3/cub3.module';
import { MomentModule } from 'ngx-moment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Cub3Module,
    MomentModule,
    AcademicoAcompanhamentoNovoPageRoutingModule
  ],
  declarations: [AcademicoAcompanhamentoNovoPage]
})
export class AcademicoAcompanhamentoNovoPageModule {}
