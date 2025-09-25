import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoImcPageRoutingModule } from './academico-imc-routing.module';

import { AcademicoImcPage } from './academico-imc.page';

import {Cub3Module} from '@cub3/cub3.module';
import {MomentModule} from "ngx-moment";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MomentModule,
    Cub3Module,
    AcademicoImcPageRoutingModule
  ],
  declarations: [AcademicoImcPage]
})
export class AcademicoImcPageModule {}
