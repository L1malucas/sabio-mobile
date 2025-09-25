import * as _ from 'lodash';
import {IMAGE_DIR, SITE_URL} from '../cub3-config'; 
import {UsuarioTipo} from "@cub3/classes/usuario_tipo";

export class ViagemRota {
    COD_OS:number = null;
    IDF_ROTA:number = null;
    TKM_TRAJETO:number = null;

    constructor(dados?:any) {
        if(dados) {
            _.assignIn(this, dados);
        }
    } 
}