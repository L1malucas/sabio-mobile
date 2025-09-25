import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MomentModule} from "ngx-moment";
import { IonicModule } from '@ionic/angular';
import {Cub3Module} from "@cub3/cub3.module";

import { AcademicoAtividadesPageRoutingModule } from './academico-atividades-routing.module';

import { AcademicoAtividadesPage } from './academico-atividades.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Cub3Module,
    IonicModule,
    MomentModule,
    AcademicoAtividadesPageRoutingModule
  ],
  declarations: [AcademicoAtividadesPage]
})
export class AcademicoAtividadesPageModule {}
