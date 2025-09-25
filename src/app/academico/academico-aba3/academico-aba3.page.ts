import { Component } from '@angular/core';  
import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc';
import {StorageUtils} from '@cub3/utils/storage.utils';
import {Usuario} from '@cub3/classes/usuario';




@Component({
  selector: 'app-academico-aba3',
  templateUrl: 'academico-aba3.page.html',
  styleUrls: ['academico-aba3.page.scss']
})
export class AcademicoAba3Page {

	usuario:Usuario = StorageUtils.getAccount();
  	logSinc:any = [];
    turmas:any[] = [];

  constructor(
  	public cub3Svc:Cub3SvcProvider
  	) {


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
  ionViewWillEnter() {
  	this.init();
  }
  async init() {

    this.usuario = StorageUtils.getAccount();
  	this.turmas = await this.cub3Svc.getTurmas();
    const logSync:any = StorageUtils.getItem("logSinc");

        if(logSync != null && logSync != '')
          this.logSinc = logSync;
        else {
          this.logSinc = [];
          StorageUtils.setItem("logSinc", this.logSinc);
        }

  }

  sincronizarTudo() {
    this.cub3Svc.sincronizar('GERAL').then(() => {
      this.cub3Svc.sincronizar('MOB_PROF_FRQ').then(() => {
        this.cub3Svc.sincronizar('MOB_AVALIACAO_NOTA').then(() => {
          this.cub3Svc.sincronizar('MOB_REGISTRO_AULA').then(() => {
            this.cub3Svc.sincronizar('MOB_OCORRENCIAS').then(() => {

            }, () => {

            });
          }, () => {

          });
        }, () => {

        });
      }, () => {

      });
    }, () => {

    });
  }

}
