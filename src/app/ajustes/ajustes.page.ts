import { Component, OnInit } from '@angular/core';
import {StorageUtils} from '@cub3/utils/storage.utils';
import {VERSAO_APP} from "@cub3/cub3-config";
import { Router, ActivatedRoute } from "@angular/router";
import { File } from '@ionic-native/file/ngx';
import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
})
export class AjustesPage implements OnInit {
	versaoApp:any = VERSAO_APP;

  constructor(
    public cub3Svc:Cub3SvcProvider, 
    private file:File, private router:Router, private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
  }

  logout() {
  	StorageUtils.logout();

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 300);
  	
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
}
