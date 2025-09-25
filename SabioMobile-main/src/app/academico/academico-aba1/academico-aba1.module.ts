import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcademicoAba1Page } from './academico-aba1.page';
import { AcademicoAbasContainerComponentModule } from '../academico-abas-container/academico-abas-container.module';
import {MomentModule} from "ngx-moment";
import { AcademicoAba1PageRoutingModule } from './academico-aba1-routing.module';
import {Cub3Module } from "@cub3/cub3.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Cub3Module,
    AcademicoAbasContainerComponentModule,
    MomentModule,
    AcademicoAba1PageRoutingModule
  ],
  declarations: [AcademicoAba1Page]
})
export class AcademicoAba1PageModule {}
