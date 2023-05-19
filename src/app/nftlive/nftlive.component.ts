import {Component, OnDestroy, OnInit} from '@angular/core';
import {NetworkService} from "../network.service";
import {environment} from "../../environments/environment";
import {wait_message} from "../hourglass/hourglass.component";
import {GalleryState, ImageItem} from "ng-gallery";
import {NFT} from "../../nft";
import {
    $$, Bank,
    getParams,
    newCryptoKey,
    CryptoKey,
    showMessage,
    get_nfluent_wallet_url,
    showError,
    isEmail, rotate, now, init_visuels, extract_bank_from_param
} from "../../tools";
import {Collection, newCollection} from "../../operation";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {StyleManagerService} from "../style-manager.service";
import {_ask_for_paiement} from "../ask-for-payment/ask-for-payment.component";
import {UserService} from "../user.service";
import {MatDialog} from "@angular/material/dialog";
import {extract_merchant_from_param, Merchant} from "../payment/payment.component";
import {DeviceService} from "../device.service";

@Component({
  selector: 'app-nftlive',
  templateUrl: './nftlive.component.html',
  styleUrls: ['./nftlive.component.css']
})
export class NftliveComponent implements OnInit,OnDestroy {
    photo: any;
    visuels:any[]=[];
    message="";
    sel_visuel: any;
    dests="";
    name="Ma Photo";
    infos="";
    miner: CryptoKey=newCryptoKey();
    stockage: string="";
    stockage_document: string="";
    appname: string="";
    claim:string="";
    collection: Collection | undefined;
    url_gallery: string = "";
    url_wallet: string = "";
    max_supply =1;
    nft_size=800;
    merchant: Merchant | undefined;
    api_key_document: string="";
    background_image="";
    joinDoc: string=""
    photographer="Anonyme";
    promo="";
    promofile="";
    show_last_step: boolean=false;
    price: number=0;
    fiat_price:number=0;
    config: string="";
    border="2%";
    size="90%";
    bank:Bank=environment.bank;
    royalties: number=0;
    show_login: boolean=false;

    public constructor(
        public network:NetworkService,
        public routes:ActivatedRoute,
        public toast:MatSnackBar,
        public user:UserService,
        public device:DeviceService,
        public style:StyleManagerService,
        public dialog:MatDialog
    ) {

    }

    ngOnInit(): void {
        this.device.isHandset$.subscribe((isHandset)=>{
            if(isHandset){this.border="0px";this.size="100%";}
        })

        setTimeout(()=>{this.read_param()},200);
        this.style.setStyle("theme","nfluent-dark-theme.css")
    }

    isSemiFungible() {
        if(!this.collection?.type)return false;
        return this.collection?.type.startsWith('SemiFungible')
    }


    onFileSelected($event: any) {
        this.photo=$event;
        this.preview()
    }


    preview(limit=10) {
        let seed=Math.round(Math.random()*100);

        $$("On récupére une première image et la taille de la sequences")
        this.network.send_photo_for_nftlive(
            limit,this.config, this.nft_size.toString(),
            80,"",[{name:"title", value:this.name}],
            {photo:this.photo}, "base64").subscribe((result:any)=>{
            this.visuels=init_visuels(result.images);
            if(this.visuels.length>0) this.sel_visuel=this.visuels[0];

            // let seq:number[]=[]
            // for(let i=1;i<result.sequences.length;i=i+1)seq.push(i);
            // this.network.send_photo_for_nftlive(
            //     limit,config, this.nft_size.toString(),
            //     80,"",[{name:"title", value:this.name}],
            //     {photo:this.photo}, "base64",seq,seed).subscribe((visuels:any)=>{
            //     this.visuels.push(init_visuels(visuels.images))
            //     wait_message(this,"");
            // })
        },(err)=>{
                showError(this,err);
                wait_message(this);
        })
    }

    restart() {
        this.sel_visuel=undefined;
        this.url_wallet="";
        this.url_gallery="";
        this.dests="";
        this.visuels=[];
        this.photo=undefined;
    }

    async read_param() {
        //Lecture des paramétres
        let params: any = await getParams(this.routes);
        $$("Lecture des parametres ", params)
        this.miner = newCryptoKey("", "", "")
        if(params.bank){
            this.bank=params.bank;
        } else {
            this.bank=extract_bank_from_param(params) || environment.bank;
        }

        this.background_image=params.visual || ""
        if(params.style)this.style.setStyle("theme",params.style);
        this.miner = newCryptoKey("","","",params.miner || environment.nftlive.miner_key)
        this.stockage = params.stockage || environment.stockage.stockage
        this.stockage_document = params.stockage_document || environment.stockage.stockage_document
        this.api_key_document=params.api_key_document || ""
        this.appname = params.appname || environment.appname
        this.claim = params.claim || environment.nftlive.claim
        this.collection = newCollection(params.collection || environment.nftlive.collection, this.miner)
        this.network.network = params.network || environment.nftlive.network
        this.merchant=extract_merchant_from_param(params) || environment.merchant;
        this.promo=params.promotion || ""
        this.promofile=params.promolink || ""

        this.royalties=params.royalties || environment.nftlive.royalties || 0
        this.royalties=Number(this.royalties.toString().replace("%",""))
        if(this.royalties>0 && this.royalties<1)this.royalties=this.royalties*100;

        this.price=params.price || environment.nftlive.crypto_price
        this.fiat_price=params.fiat_price || environment.nftlive.fiat_price
        this.config=params.config || environment.appli+"/assets/config_nftlive.yaml"
    }

    return_error(){
            wait_message(this);
            showMessage(this,"Incident technique, veuillez recommencer");
    }

    async ask_for_mint(){
        let rep:any=await _ask_for_paiement(this,
            this.merchant!.wallet!.token,
            this.price,
            this.fiat_price,
            this.merchant!,
            this.user.wallet_provider,
            "Frais de fabrication et d'enregistrement du NFT",
             "",
            "",
            "",{contact: "", description: "", subject: ""},"",this.bank)

        if(rep){
            this.user.init_wallet_provider(rep.data.provider,rep.address)
            this.user.buy_method=rep.buy_method;
            if(this.dests=='')this.dests=rep.address;
            this.mint();
        } else {
            showMessage(this,"Annulation");
        }
    }

    async mint() {
        if(!this.dests || this.dests.length==0) {
            showMessage(this,"Vous devez indiquer votre adresse ou l'adresse d'un destinataire pour créer ce NFT");
        } else {
            let idx=0;
            for(let address of this.dests.split(' ')){
                wait_message(this,"Création d'un wallet pour "+address);
                this.network.create_account(
                    this.network.network,
                    address,
                    environment.appli+"/assets/wallet_access.html",
                    environment.appli+"/assets/existing_account_wallet_access.html"
                ).subscribe(async (account:any)=> {
                    wait_message(this,"Fabrication du NFT");
                    let owner=account.address

                    this.network.upload(this.photo.file,this.stockage_document,this.api_key_document).subscribe(async (file:any)=>{
                        let files=(this.joinDoc=="checked") ? [file] : [];
                        if(this.photographer.length==0)this.photographer=owner;
                        let attributes=[
                            {trait_type:"Prise de vue",value:now("datetime")},
                            {trait_type:"Photographe",value:this.photographer}
                        ]
                        if(this.promo.length>0)attributes.push({trait_type:"Evénement",value:this.promo});
                        if(this.promofile.length>0)files.push(this.promofile);

                        this.network.upload(this.sel_visuel.data.src,this.stockage).subscribe(async (addr_visual:any)=>{
                            let nft:NFT={
                                balances: undefined,
                                type: this.max_supply==1 ? "NonFungible" : "SemiFungible",
                                address: undefined,
                                attributes: attributes,
                                collection: this.collection,
                                creators: [{address:this.miner.address,share:100,verified:true}],
                                description: this.infos,
                                files: files,
                                links: undefined,
                                supply:this.max_supply,
                                price: 0,
                                message: undefined,
                                miner: this.miner,
                                name: this.name,
                                network: this.network.network,
                                owner: owner,
                                royalties: this.royalties,
                                solana: undefined,
                                style: undefined,
                                symbol: "NFTLive NFT #"+idx,
                                tags: "NFTLive",
                                visual: addr_visual.url
                            }
                            $$("Minage du NFT attribué a "+account.address,nft)
                            idx=idx+1;
                            let minage:any=await this.network.mint(nft,this.miner,owner,"",false,this.stockage,this.network.network)

                            wait_message(this);
                            if(minage.error==""){
                                if(isEmail(address))showMessage(this,"Consulter votre mail "+address+" pour retrouver votre NFT")
                                this.url_wallet=get_nfluent_wallet_url(owner,this.network.network,environment.wallet);
                                this.url_gallery=minage.link_nft_gallery;
                            } else {
                                showMessage(this,"Probleme technique "+minage.error)
                            }
                        },()=>{this.return_error();});
                    })
                },()=>{this.return_error()});
            }
        }
    }

    clear_preview() {
        this.visuels=[];
    }

    select_visuel($event: GalleryState) {
        this.sel_visuel=this.visuels[$event.currIndex!];
    }

    async rotate_photo() {
        if(this.photo.file){
            this.photo.file=await rotate(this.photo.file,90);
            this.preview();
        }
    }


    is_animated_photo() {
        let file=this.photo.file.substring(0,100);
        return file.indexOf("gif")>-1
    }

    ngOnDestroy(): void {
        $$("Appel de onDestroy")
        this.user.logout()
    }

    login(event:any) {
        this.user.init_wallet_provider(event.provider,event.address)
        this.show_login=false;
    }

    disconnect() {
        this.show_login=false;
    }

    fail(addr:string) {
        this.show_login=false;
    }

    cancel() {
        this.show_login=false;
    }
}
