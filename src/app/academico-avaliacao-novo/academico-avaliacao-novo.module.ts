import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatePickerModule } from 'ionic4-date-picker';
import { AcademicoAvaliacaoNovoPageRoutingModule } from './academico-avaliacao-novo-routing.module';

import { AcademicoAvaliacaoNovoPage } from './academico-avaliacao-novo.page';
import {Cub3Module} from '@cub3/cub3.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatePickerModule,
    Cub3Module,
    AcademicoAvaliacaoNovoPageRoutingModule
  ],
  declarations: [AcademicoAvaliacaoNovoPage]
})
export class AcademicoAvaliacaoNovoPageModule {}
