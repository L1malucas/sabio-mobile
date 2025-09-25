import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeusDadosRegistroJornadaNovoPageRoutingModule } from './meus-dados-registro-jornada-novo-routing.module';

import { MeusDadosRegistroJornadaNovoPage } from './meus-dados-registro-jornada-novo.page';
import {Cub3Module} from "@cub3/cub3.module";
import { MomentModule } from 'ngx-moment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MomentModule,
    Cub3Module,
    MeusDadosRegistroJornadaNovoPageRoutingModule
  ],
  declarations: [MeusDadosRegistroJornadaNovoPage]
})
export class MeusDadosRegistroJornadaNovoPageModule {}
