import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SincronizacaoPageRoutingModule } from './sincronizacao-routing.module';

import { SincronizacaoPage } from './sincronizacao.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SincronizacaoPageRoutingModule
  ],
  declarations: [SincronizacaoPage]
})
export class SincronizacaoPageModule {}
