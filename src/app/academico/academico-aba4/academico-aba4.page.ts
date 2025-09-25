import { Component } from '@angular/core';  
import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc';
import {StorageUtils} from '@cub3/utils/storage.utils';
import {NODE_URL} from "@cub3/cub3-config";
import {Usuario, Arquivo} from '@cub3/classes';
import { ActionSheetController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { File } from '@ionic-native/file/ngx';
import { Cub3DbProvider } from '@cub3/cub3-db/cub3-db';

@Component({
  selector: 'app-academico-aba4',
  templateUrl: 'academico-aba4.page.html',
  styleUrls: ['academico-aba4.page.scss']
})
export class AcademicoAba4Page {

	usuario:Usuario = StorageUtils.getAccount();
  abaAtiva:any = 'documentos';
  	logSinc:any = [];
    arquivos:Arquivo[] = [];

  constructor(
  	public cub3Svc:Cub3SvcProvider,
    private cub3Db:Cub3DbProvider,
    private file:File, 
    private router:Router, 
    private activatedRoute:ActivatedRoute,
    private actionSheetController:ActionSheetController
  	) {

      this.init()
  }  

  logout() {
  	StorageUtils.logout();

    setTimeout(() => {
      this.router.navigate(['/']);
    }, 300);
  }

  async limparDados() {
    let carregar:any = await this.cub3Svc.carregar(1, "Atualizando...");

    await this.cub3Db.setStorage("MOB_REGISTRO_AULA", []);
    await this.cub3Db.setStorage("MOV_REGISTRO_FREQUENCIA", []);

    await this.cub3Svc.sincronizar("MOB_REGISTRO_AULA");
    carregar.dismiss();

  }
  async sincronizar() {
    let carregar:any = await this.cub3Svc.carregar(1, "Atualizando...");

      let escolas:any = {};
      try {
        
      const dados = await this.cub3Svc.getNode(`educanet/profissional/mobile`);

      if(dados && dados.dados)
        escolas = dados.dados || {};
      }
      catch(e) {

      }

      StorageUtils.setItem("escolas", escolas); 

      carregar.dismiss();
  }
  async apagarArquivos() {
    let diretorios:any = ['videos', 'materiais'];
    let carregar:any = await this.cub3Svc.carregar(1, "Removendo arquivos...");

    for(let item of diretorios) {
      this.file.listDir(this.file.dataDirectory,item).then((result)=>{ 
              for(let file of result){
                  if(file.isFile == true){
                      this.file.removeFile(this.file.dataDirectory+item, file.name).then( data => {
                          console.log('Arquivo removido: ', this.file);
                          data.fileRemoved.getMetadata(function (metadata) {
                              let name = data.fileRemoved.name;
                              let size = metadata.size ;
                              let fullPath = data.fileRemoved.fullPath; 
                          }) ;
                      }).catch( error => {
                          file.getMetadata(function (metadata) {
                              let name = file.name ;
                              let size = metadata.size ;
                              console.log('Erro ao deletar arquivo: ', error);
                          }) ;
                      });

                  }
              }
          }) ;

    }
    setTimeout(() => {
      carregar.dismiss();
      this.cub3Svc.alerta("Remoção de arquivos", "Arquivo removido com sucesso!");
    }, 3000);    
  }
  async getMateriais() {
    const carregar = await this.cub3Svc.carregar(1);
    this.cub3Svc.getNode("arquivos/listar?limiteInicial=0&limiteFinal=9").then((res:any) => {
      carregar.dismiss();
      if(res && res.dados) {
        this.arquivos = res.dados;
      }
    }, () => {
      carregar.dismiss();
    })
  }

  async selecionarArquivo(arquivo:any) {
    const actionSheet = await this.actionSheetController.create({
      header: `Arquivo: ${arquivo.titulo}`,
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Deletar',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'Compartilhar',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Baixar',
        icon: 'download',
        handler: () => { 
          this.cub3Svc.download(NODE_URL + "arquivo?url=" + arquivo.src)
            .subscribe(blob => {
              const a = document.createElement('a');
              const tipo = arquivo.mimeType.split("/");
              const objectUrl = URL.createObjectURL(blob);
              a.href = objectUrl;
              a.download = arquivo.arquivo;
              a.click();
              URL.revokeObjectURL(objectUrl);
            }) 
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
  }
  ionViewWillEnter() {
  	this.init();
  }
  async init() {
    this.usuario = StorageUtils.getAccount();
    this.getMateriais();
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
