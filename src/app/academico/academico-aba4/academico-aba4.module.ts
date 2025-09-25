import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcademicoAba4Page } from './academico-aba4.page';
import { AcademicoAbasContainerComponentModule } from '../academico-abas-container/academico-abas-container.module';
import {MomentModule} from "ngx-moment";
import { AcademicoAba4PageRoutingModule } from './academico-aba4-routing.module';
import {Cub3Module } from "@cub3/cub3.module";


@NgModule({
  imports: [
    IonicModule,
    Cub3Module,
    CommonModule,
    FormsModule,
    MomentModule,
    AcademicoAbasContainerComponentModule,
    RouterModule.forChild([{ path: '', component: AcademicoAba4Page }]),
    AcademicoAba4PageRoutingModule,
  ],
  declarations: [AcademicoAba4Page]
})
export class AcademicoAba4PageModule {}
