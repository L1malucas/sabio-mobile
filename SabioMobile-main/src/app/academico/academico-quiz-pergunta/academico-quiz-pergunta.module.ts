import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Cub3Module} from "@cub3/cub3.module";
import { IonicModule } from '@ionic/angular';

import { AcademicoQuizPerguntaPageRoutingModule } from './academico-quiz-pergunta-routing.module';

import { AcademicoQuizPerguntaPage } from './academico-quiz-pergunta.page';

@NgModule({
  imports: [
    CommonModule,
    Cub3Module,
    FormsModule,
    IonicModule,
    AcademicoQuizPerguntaPageRoutingModule
  ],
  declarations: [AcademicoQuizPerguntaPage]
})
export class AcademicoQuizPerguntaPageModule {}
