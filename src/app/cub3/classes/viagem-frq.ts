import * as _ from 'lodash';
import {IMAGE_DIR, SITE_URL} from '../cub3-config'; 
import {UsuarioTipo} from "@cub3/classes/usuario_tipo";

export class ViagemFrequencia {
    COD_OS:number = null;
    IDF_ALUNO:number = null;
    SIT_ALUNO:string = null;

    constructor(dados?:any) {
        if(dados) {
            _.assignIn(this, dados);
        }
    } 
}