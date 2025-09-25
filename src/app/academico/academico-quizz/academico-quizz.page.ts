import { Component, OnInit } from '@angular/core';
import {StorageUtils} from "@cub3/utils/storage.utils";
import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc';
import {Quiz} from "@cub3/classes";

@Component({
  selector: 'app-academico-quizz',
  templateUrl: './academico-quizz.page.html',
  styleUrls: ['./academico-quizz.page.scss'],
})
export class AcademicoQuizzPage implements OnInit {

  quizz:Quiz[] = [];
  constructor(
    private cub3Svc:Cub3SvcProvider
    ) { }

  ngOnInit() {
    

  }
  ionViewWillEnter() {
    this.getQuizzes();
  }

  async getQuizzes() {
    const carregar = await this.cub3Svc.carregar(1);
    this.cub3Svc.getNode("quiz/listar").then((r: any) => {
      carregar.dismiss();
      if(r && r.dados)
        this.quizz = r.dados;
    }, () => {   
      carregar.dismiss();
    });
  }
  async remover(quiz:Quiz) {
    const carregar = await this.cub3Svc.carregar(1);
    this.cub3Svc.postNode("quiz/deletar", {id: quiz.id}).then((r:any) => {
      carregar.dismiss();
      this.cub3Svc.alertaToast("Remoção de Quiz", "Quiz removido com sucesso!");
      this.getQuizzes();
    }, () => {
      carregar.dismiss();
      this.cub3Svc.alerta("Ops!", "Não foi possível remover o quiz.");
    });
  }
}
