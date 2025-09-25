import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoAulaNovoPageRoutingModule } from './academico-aula-novo-routing.module';
import { DatePickerModule } from 'ionic4-date-picker';

import { AcademicoAulaNovoPage } from './academico-aula-novo.page';
import {Cub3Module} from '@cub3/cub3.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatePickerModule,
    Cub3Module,
    AcademicoAulaNovoPageRoutingModule
  ],
  declarations: [AcademicoAulaNovoPage]
})
export class AcademicoAulaNovoPageModule {}
