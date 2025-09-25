import * as _ from 'lodash';
import {IMAGE_DIR, SITE_URL} from '../cub3-config'; 
import {UsuarioTipo} from "@cub3/classes/usuario_tipo";

export class Viagem {
    COD_OS:number = null;
    DAT_OS:Date = null;
    IDF_VEICULO:number = null;
    COD_MOTORISTA:number = null;
    DAT_SAIDA:Date = null;
    DAT_RETORNO:Date = null;
    KM_SAIDA:number = null;
    KM_RETORNO:number = null;
    KM_RODADO:number = null;
    OBSERVACAO:string = "";
    STATUS:string = null;
    TIP_ROTA:string = 'IDA';

    constructor(dados?:any) {
        if(dados) {
            _.assignIn(this, dados);
        }
    } 
}