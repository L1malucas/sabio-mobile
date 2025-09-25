import * as _ from 'lodash';
import {IMAGE_DIR, SITE_URL, AVATAR_DIR, BACKEND_URL} from '@cub3/cub3-config';
import * as isBase64 from "is-base64";

export class AlunoAssinatura { 
	id:number = null;
	aluno_id:number = null;
	codigo_retorno:number = null;
	foto:string = null;
	foto2:string = null;
	assinatura:string = null;
	digital_1:string = null;
	digital_2:string = null;
	digital_3:string = null;
	digital_4:string = null;
	digital_5:string = null;
	digital_6:string = null;
	digital_7:string = null;
	digital_8:string = null;
	digital_9:string = null;
	digital_10:string = null;
	horario_cadastro:Date = null;
	data_nascimento:Date = null;
	nome_candidato:string = null;
	numero_cpf:string = null;
	numero_rg:string = null;
	orgao_expedidor:string = null;
	uf:string = null;

    constructor(dados?:any) {  
        if(dados) {

        	if(!dados.foto && dados.foto2)
        		dados.foto = this.foto2;

            _.assignIn(this, dados);
        }
    } 
    getAvatar() {
    	if(!this.foto && !this.foto2)
    		return this.foto ? `${BACKEND_URL}${this.foto}` : `${IMAGE_DIR}/others/uploads/avatar/padrao.png`;
    	else if(!this.foto && this.foto2) {
    		return this.foto2 ? `${BACKEND_URL}${this.foto2}` : `${IMAGE_DIR}/others/uploads/avatar2/padrao.png`;
    	}

        if(isBase64(this.foto)){

	        if(this.foto.search("base64") != -1)
	            return this.foto;
	        else
	            return `data:image/png;base64,${this.foto}`;
        }
        else if(this.foto.search("uploads/") != -1){
    		this.foto.replace("others/uploads/conteudo/", "");
            return this.foto ? `${BACKEND_URL}${this.foto}` : `${IMAGE_DIR}/others/uploads/avatar/padrao.png`;
        }
        else if(this.foto.search("://") == -1)
            return this.foto ? `${AVATAR_DIR}${this.foto}` : `${IMAGE_DIR}/others/uploads/avatar/padrao.png`;
        else
            return this.foto;
    }
    getNome() {
        return this.nome_candidato;
    }
} 