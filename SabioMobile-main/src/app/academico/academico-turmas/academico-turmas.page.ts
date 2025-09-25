import { Component, OnInit } from '@angular/core';
import { Cub3SvcProvider } from '@cub3/cub3-svc/cub3-svc';
import {StorageUtils} from '@cub3/utils/storage.utils';

@Component({
  selector: 'app-academico-turmas',
  templateUrl: './academico-turmas.page.html',
  styleUrls: ['./academico-turmas.page.scss'],
})
export class AcademicoTurmasPage implements OnInit {

	data:any = {MOB_TURMAS: []};
  turmas:any[] = [];
  
  constructor(
    private cub3Svc:Cub3SvcProvider
  ) { }

  ngOnInit() {
  	this.init();
  }

  listarTurmas(escolas) {
    let turmas = [];
    
    escolas.forEach(escola => {
      escola.turmas.forEach(turma => {
      turmas.push(turma);
      });
    });
    
    return turmas;
    }
  async init() {
  	this.turmas = await this.cub3Svc.getTurmas()
  }

}
