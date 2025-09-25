import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoEtapasPageRoutingModule } from './academico-etapas-routing.module';

import { AcademicoEtapasPage } from './academico-etapas.page';
import {Cub3Module} from '@cub3/cub3.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Cub3Module,
    IonicModule,
    AcademicoEtapasPageRoutingModule
  ],
  declarations: [AcademicoEtapasPage]
})
export class AcademicoEtapasPageModule {}
