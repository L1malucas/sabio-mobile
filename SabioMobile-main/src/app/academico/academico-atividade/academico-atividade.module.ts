import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoAtividadePageRoutingModule } from './academico-atividade-routing.module';

import { AcademicoAtividadePage } from './academico-atividade.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcademicoAtividadePageRoutingModule
  ],
  declarations: [AcademicoAtividadePage]
})
export class AcademicoAtividadePageModule {}
