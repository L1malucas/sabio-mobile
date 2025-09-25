import { Component, OnInit } from '@angular/core'; 
import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc';
import {Cub3DbProvider} from '@cub3/cub3-db/cub3-db';

@Component({
  selector: 'app-meus-dados-disciplinas',
  templateUrl: './meus-dados-disciplinas.page.html',
  styleUrls: ['./meus-dados-disciplinas.page.scss'],
})
export class MeusDadosDisciplinasPage implements OnInit {

data:any = {MOB_DISCIPLINAS: []};
  turma:number;

  constructor(
  	private cub3Db:Cub3DbProvider,
    private cub3Svc:Cub3SvcProvider
    ) { 
  }

  ngOnInit() {
  }

  init() {

    let carregar:any = this.cub3Svc.carregar(1);
      this.cub3Db.query("SELECT * FROM MOB_DISCIPLINAS GROUP BY IDF_DISCIPLINA").then((data:any) => {
        if(data != undefined) {
          for (var i = 0; i < data.rows.length; i++) {
            this.data.MOB_DISCIPLINAS.push(data.rows.item(i));
            console.log( this.data.MOB_DISCIPLINAS);
          }
        }
        carregar.dismiss();
      });
  }
}
