import * as _ from 'lodash';
import {IMAGE_DIR, SITE_URL} from '@cub3/cub3-config'; 

export class UsuarioTipo {
    id:string = null;
    label:string = "";
    classe:string = "";
    idSistema:string = "";
    idLogin:string = "";

    constructor(dd?:any) {
        if(dd) {
            _.assignIn(this, dd);
        }
    } 
}