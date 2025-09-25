import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeusDadosPaginaPageRoutingModule } from './meus-dados-pagina-routing.module';

import { MeusDadosPaginaPage } from './meus-dados-pagina.page';
import {Cub3Module} from "@cub3/cub3.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Cub3Module,
    IonicModule,
    MeusDadosPaginaPageRoutingModule
  ],
  declarations: [MeusDadosPaginaPage]
})
export class MeusDadosPaginaPageModule {}
