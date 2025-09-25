import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoPlanoEnsinoPageRoutingModule } from './academico-plano-ensino-routing.module';

import { AcademicoPlanoEnsinoPage } from './academico-plano-ensino.page';
import {Cub3Module} from '@cub3/cub3.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Cub3Module,
    IonicModule,
    AcademicoPlanoEnsinoPageRoutingModule
  ],
  declarations: [AcademicoPlanoEnsinoPage]
})
export class AcademicoPlanoEnsinoPageModule {}
