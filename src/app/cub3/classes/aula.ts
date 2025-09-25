import * as _ from 'lodash';
import moment from 'moment-timezone/moment-timezone';
import {IMAGE_DIR, SITE_URL, BACKEND_URL} from '@cub3/cub3-config'; 

export class Aula {
        id:number = null;
        aula:any;
        profissional:any;
        curso:any;
        tema:any;
        instrutor:any;
        horario_agendado:any;
        sala:any;
        instrutor_biometria_dedo_fechamento:any;
        profissional_assinatura:any;
        alunos:any[] = new Array<any>();
        facialAberturaInstrutor:string;
        facialFechamentoInstrutor:string;
        facialAberturaAluno:string;
        facialFechamentoAluno:string;
        titulo:string;
        instrutor_biometria_dedo_abertura:any;
        duracao:number = 50;
        fotos:any[] = [];
        status:string;
        horario_abertura:any;
        horario_aula_termino_expectativa:any;
        curso_id:any = "1";
        imagem:string;
        horario_cadastro:any;
        stream:string;
        detran_sequencial_aula:string;
        digitalAberturaInstrutor:string;
        digitalFechamentoInstrutor:string;
        digitalAberturaAluno:string;
        digitalFechamentoAluno:string;
        curso_tema_id:string;
        aula_id:number;
        profissional_id:number;
        tema_id:any;
        sala_id:any;
        horario_fechamento:any;
        tipo:string;
        liberarDigitalInstrutor:boolean = false;
        foto_instrutor:string;
        detran_mensagem_retorno:string;
        liberar_digital:any;
        profissional_video_token:any;
        camera:any;
        microfone:any;
        facial_abertura_instrutor:any;

    constructor(dados?:any) {  
        if(dados) {
        let aux:any = dados;
 
            aux.data             = this.tratarData(aux.data);
            _.assignIn(this, dados);
        }
    }   
    getStatus() {
        return this.status == 'PENDENTE' ? 'Em abertura' : this.status;
    }
    getFormato() {
        return this.tipo == 'REMOTO' ? 'Aula remota' : 'Aula presencial';
    }
    tratarData(data:any) {
        if(data)
            return moment(data).format('YYYY-MM-DD HH:mm:ss');
        else
            return null;
    } 
    getAvatarInstrutor() {
        return BACKEND_URL+this.foto_instrutor;
    }
} 