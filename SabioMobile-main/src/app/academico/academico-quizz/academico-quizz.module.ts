import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MomentModule} from "ngx-moment";
import { IonicModule } from '@ionic/angular';
import {Cub3Module} from "@cub3/cub3.module";
import { AcademicoQuizzPageRoutingModule } from './academico-quizz-routing.module';

import { AcademicoQuizzPage } from './academico-quizz.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MomentModule,
    Cub3Module,
    IonicModule,
    AcademicoQuizzPageRoutingModule
  ],
  declarations: [AcademicoQuizzPage]
})
export class AcademicoQuizzPageModule {}
