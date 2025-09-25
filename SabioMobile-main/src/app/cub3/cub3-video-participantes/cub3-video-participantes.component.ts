import {
    Component,
    ViewChild,
    ElementRef,
    Output,
    Input,
    EventEmitter,
    Renderer2
} from '@angular/core';
import {
    Participant,
    RemoteTrack,
    RemoteAudioTrack,
    RemoteVideoTrack,
    RemoteParticipant,
    RemoteTrackPublication
} from 'twilio-video';
import {Aula} from "@cub3/classes/aula";
import { Router, ActivatedRoute } from "@angular/router";
import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc';
import {StorageUtils} from '@cub3/utils/storage.utils';
import {Usuario} from '@cub3/classes/usuario';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Plugins } from '@capacitor/core'; 
const { FileSelect } = Plugins;  
import { Platform } from '@ionic/angular';
import {NODE_URL} from "@cub3/cub3-config";

@Component({
  selector: 'cub3-video-participantes',
  templateUrl: './cub3-video-participantes.component.html',
  styleUrls: ['./cub3-video-participantes.component.scss']
})
export class Cub3VideoParticipantesComponent {
    @ViewChild('list', { static: false }) listRef: ElementRef;
    @ViewChild('dominant', { static: false }) dominantRef: ElementRef;
    @Output('participantsChanged') participantsChanged = new EventEmitter<boolean>();
    @Output('leaveRoom') leaveRoom = new EventEmitter<boolean>();
    @Output('mensagemEnviada') mensagemEnviada = new EventEmitter<string>();
    @Output('novoAluno') novoAluno = new EventEmitter<boolean>();
    @Output('excluirAula') excluirAula = new EventEmitter<boolean>();
    @Input('activeRoomName') activeRoomName: string;
    @Input('aula') aula: Aula;
    @Input('turma') turma: any;
    @Input('mensagens') mensagens: any[];
    @Output('sairAula') sairAula = new EventEmitter<boolean>();
    @Output('alterarCamera') alterarCamera = new EventEmitter<boolean>();
    @Output('compartilharDesktop') compartilharDesktop = new EventEmitter<boolean>();
    @Output('recarregarAula') recarregarAula = new EventEmitter<boolean>();
    @Output('microfoneAberto') MicrofoneAberto = new EventEmitter<boolean>();
    @Input('microfoneAberto') microfoneAberto = false;
    @Input('microfoneAtivo') microfoneAtivo:boolean = false;
    @Input('capturandoFoto') capturandoFoto: boolean = false;
    @Input('subscriber') subscriber: any;
    @Input('tela') tela: any;
    @Input('session') session:any;
    public compartilhandoTela:boolean = false;
      @ViewChild("mensagensFrame", {static: false}) mensagensFrame: ElementRef;
    public chat:string = ""; 
    scrollContainer:any;
    get participantCount() {
        return !!this.participants ? this.participants.size : 0;
    }

    get isAlone() {
        return this.participantCount === 0;
    }
    public usuario:Usuario = StorageUtils.getAccount();

    private participants: Map<Participant.SID, RemoteParticipant>;
    private dominantSpeaker: RemoteParticipant;
    private enviandoMensagem:boolean = false;

    slideOpts:any =  {
        initialSlide: 1,
        slidesPerView: 10,
        speed: 400
      };
    menuAtivo:any = "camera";

    constructor(
        private cub3Svc:Cub3SvcProvider,
        private fileChooser:FileChooser,
        private platform:Platform,
        private router:Router, 
        private readonly renderer: Renderer2 ) { 

        switch (this.usuario.perfil) {
            case "PROFESSOR":
                    this.microfoneAberto = true;
                    this.microfoneAtivo = true;
                break;
        }
    }

    clear() {
        if (this.participants) {
            this.participants.clear();
        }
    }
    alterarMenu(menu:any) {
        console.log("menu", menu);
    }

    initialize(participants: Map<Participant.SID, RemoteParticipant>) {
        this.participants = participants;
        if (this.participants) {
            this.participants.forEach(participant => this.registerParticipantEvents(participant));
        }
    }

    add(participant: RemoteParticipant) {
        if (this.participants && participant) {
            this.participants.set(participant.sid, participant);
            this.registerParticipantEvents(participant);
        }
    }

    remove(participant: RemoteParticipant) {
        if (this.participants && this.participants.has(participant.sid)) {
            this.participants.delete(participant.sid);
        }
    }

    AlterarCamera() {
        this.alterarCamera.emit(true);
    }
    desabilitarVoz() {
        this.microfoneAberto = false;      
    }
    verificarAutor(item:any) {
        switch (this.usuario.perfil) {
            case "PROFESSOR":
                return item.profissional_id == this.usuario.id;            
            case "ALUNO":
                return item.aluno_id == this.usuario.id; 
            default:
                return false;
        }
    }
    loudest(participant: any) {
        this.dominantSpeaker = participant;
        if (participant) {
            participant.tracks.forEach((publication:any) =>   {
            console.log("Dominant",publication);
                if(publication.isSubscribed && publication.kind == 'video') {
                    const track = publication.track;
                    const element = track.attach(); 
                     const childElements = this.dominantRef.nativeElement.childNodes;
                    for (let child of childElements) {
                      this.renderer.removeChild(this.dominantRef.nativeElement, child);
                    }


                    this.renderer.data.id = track.sid;
                    this.renderer.setStyle(element, 'width', '100%');
                    this.renderer.addClass(element, 'dominant'); 
                    this.renderer.appendChild(this.dominantRef.nativeElement, element);                   
                }
            });
        }


    }
    sair() {
        this.onLeaveRoom();
        this.router.navigate(['/app/home/academico']);
    }
    onLeaveRoom() {
        this.leaveRoom.emit(true);
    }

    private registerParticipantEvents(participant: RemoteParticipant) {
        if (participant) { 

            participant.tracks.forEach(publication => this.subscribe(publication));
            participant.on('trackPublished', publication => this.subscribe(publication));
            participant.on('trackUnpublished',
                publication => {
                    if (publication && publication.track) {
                        this.detachRemoteTrack(publication.track);
                    }
                });
        }
    }

    private subscribe(publication: RemoteTrackPublication | any) {
        if (publication && publication.on) {
            publication.on('subscribed', track => this.attachRemoteTrack(track));
            publication.on('unsubscribed', track => this.detachRemoteTrack(track));
        }
    }

    private subscribeDominant(publication: RemoteTrackPublication | any) {
        if (publication && publication.on) {
            publication.on('subscribed', track => this.attachRemoteTrack(track, true));
        }
    }

    private attachRemoteTrack(track: RemoteTrack, dominant?:boolean) {
        if (this.isAttachable(track)) {
            const element = track.attach();  
                this.renderer.data.id = track.sid;
                this.renderer.setStyle(element, 'width', '25%'); 
                this.renderer.addClass(element, 'individual'); 
                this.renderer.setStyle(element, 'max-height', '10vh');
                this.renderer.setStyle(element, 'object-fit', 'cover');
                this.renderer.appendChild(this.listRef.nativeElement, element);
       
            this.participantsChanged.emit(true);
        }
    }

    private detachRemoteTrack(track: RemoteTrack) {
        if (this.isDetachable(track)) {
            track.detach().forEach(el => el.remove());
            this.participantsChanged.emit(true);
        }
    }

    private isAttachable(track: RemoteTrack): track is RemoteAudioTrack | RemoteVideoTrack {
        return !!track &&
            ((track as RemoteAudioTrack).attach !== undefined ||
            (track as RemoteVideoTrack).attach !== undefined);
    }

    private isDetachable(track: RemoteTrack): track is RemoteAudioTrack | RemoteVideoTrack {
        return !!track &&
            ((track as RemoteAudioTrack).detach !== undefined ||
            (track as RemoteVideoTrack).detach !== undefined);
    }

    public enviarMensagem() { 
        if(this.enviandoMensagem || this.chat == '')
            return;

        this.enviandoMensagem = true;
        this.cub3Svc.postNode("aulas/chat/novo", {
            aula_id: this.aula.id,
            tipo: this.usuario.perfil == 'PROFESOR' ? 'Usuario' : 'Aluno',
            conteudo: this.chat
        }).then((res:any) => {
            this.mensagemEnviada.emit(this.chat);
            this.chat = "";
            this.enviandoMensagem = false;
        }, (err:any) => {
            this.enviandoMensagem = false;
        });
    }
    public uploadArquivo(formData:any) { 
        if(this.enviandoMensagem)
            return;

        console.log("Enviando arquivo", formData);
        formData.append("aula_id", this.aula.id);
        formData.append("tipo", 'Usuario');

        this.enviandoMensagem = true;
        this.cub3Svc.postFormData("aulas/chat/novoArquivo", formData).then((res:any) => {
            console.log("Retorno arquivo", res);
            this.mensagemEnviada.emit("update");
            this.chat = "";
            this.enviandoMensagem = false;
        }, (err:any) => {
            console.error("Erro ao enviar", err);
            this.enviandoMensagem = false;
        });
    }
    getPrimeiroNome(nome:string):string {
        try {
            return nome.split(' ')[0];
        }
        catch(err) {
            return '';
        }
    }
    scrollMensagens() {
        if(this.mensagensFrame)
            this.scrollContainer = this.mensagensFrame.nativeElement;  

            setTimeout(() => {
                if(this.scrollContainer){
                    this.scrollContainer.scroll({
                      top: 400 + (this.mensagens.length*1000),
                      left: 0,
                      behavior: 'smooth'
                    });
                }
            }, 200);
    }
    finalizarAula() {
        this.sairAula.emit(true);
    }
    ExcluirAula() {
        this.excluirAula.emit(true);
    }
    AddAluno() {
        this.novoAluno.emit(true);
    }
    CompartilharDesktop() {
        this.compartilhandoTela = !this.compartilhandoTela;
        this.compartilharDesktop.emit(true);
    }
    RecarregarAula() {
        this.recarregarAula.emit(true);
    }
    ativarVoz(evt) {
        this.microfoneAberto = !this.microfoneAberto;
        this.MicrofoneAberto.emit(this.microfoneAberto);
    }
    uploadFile(arquivo:any) {
        const data = arquivo.target.files[0];
        console.log(data);
        let formData = new FormData();
        formData.append( "arquivo[]", data, (data.name).replace(/[^a-z0-9]/gi, '_')); 
        this.uploadArquivo(formData);
    }
    async enviarArquivo(uploader:any) {
        if(this.platform.is("android")){
            let selectedFile = await FileSelect.select({multiple_selection: true, ext: ["*"]});
            let formData = new FormData();
            let paths = (selectedFile.files);
            // for (let index = 0; index < paths.length; index++) {
               const file = await fetch(paths[0].path).then((r) => r.blob());
               formData.append("arquivo[]",file,paths[0].name + paths[0].extension); 
               this.uploadArquivo(formData);
            // }
        }
        else if(this.platform.is("ios")) {
            let selectedFile = await FileSelect.select({multiple_selection: true, ext: ["*"]});
            let formData = new FormData();
            // for (let index = 0; index < selectedFile.paths.length; index++) {
            const file = await fetch(selectedFile.paths[0]).then((r) => r.blob());
            formData.append("arquivo[]", file, selectedFile.original_names[0] + selectedFile.extensions[0]); 
            this.uploadArquivo(formData);
            // }
        }
        else {
            uploader.click();
            // FileSelect.addListener("onFilesSelected", (data:FileList) => {
            //     formData.append( "arquivo[]", data.item(0), data.item(0).name + data.item(0).type); 
            //     this.uploadArquivo(formData);
            // });
        }
    }
    abrirArquivo(arquivo:any) {
        console.log(arquivo);
        // window.open(NODE_URL + "arquivo?url=" + arquivo.arquivo);

    this.cub3Svc.download(NODE_URL + "arquivo?url=" + arquivo.arquivo)
      .subscribe(blob => {
        const a = document.createElement('a');
        const tipo = arquivo.arquivo_tipo.split("/");
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = arquivo.arquivo_nome+'.'+tipo[1];
        a.click();
        URL.revokeObjectURL(objectUrl);
      })
    }
}
