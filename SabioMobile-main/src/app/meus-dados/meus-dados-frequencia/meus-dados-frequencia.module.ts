import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeusDadosFrequenciaPageRoutingModule } from './meus-dados-frequencia-routing.module';

import { MeusDadosFrequenciaPage } from './meus-dados-frequencia.page';
import {Cub3Module} from "@cub3/cub3.module";
import {MomentModule} from "ngx-moment";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MomentModule,
    IonicModule,
    Cub3Module,
    MeusDadosFrequenciaPageRoutingModule
  ],
  declarations: [MeusDadosFrequenciaPage]
})
export class MeusDadosFrequenciaPageModule {}
