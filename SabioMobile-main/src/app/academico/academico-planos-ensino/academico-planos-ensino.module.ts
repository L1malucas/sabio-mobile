import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoPlanosEnsinoPageRoutingModule } from './academico-planos-ensino-routing.module';

import { AcademicoPlanosEnsinoPage } from './academico-planos-ensino.page';
import {Cub3Module} from '@cub3/cub3.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Cub3Module,
    AcademicoPlanosEnsinoPageRoutingModule
  ],
  declarations: [AcademicoPlanosEnsinoPage]
})
export class AcademicoPlanosEnsinoPageModule {}
