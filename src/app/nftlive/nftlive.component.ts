import {Component,  OnDestroy, OnInit} from '@angular/core';
import {NetworkService} from "../network.service";
import {environment} from "../../environments/environment";
import {wait_message} from "../hourglass/hourglass.component";
import {GalleryState, ImageItem} from "ng-gallery";
import {NFT} from "../../nft";
import {
  $$, Bank,
  getParams,
  CryptoKey,
  showMessage,
  showError,
  isEmail, rotate, now, apply_params, detect_type_network
} from "../../tools";
import {Collection, Connexion, newCollection} from "../../operation";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {StyleManagerService} from "../style-manager.service";
import {_ask_for_paiement} from "../ask-for-payment/ask-for-payment.component";
import {UserService} from "../user.service";
import {MatDialog} from "@angular/material/dialog";
import {extract_merchant_from_param, Merchant} from "../payment/payment.component";
import {DeviceService} from "../device.service";
import {NgNavigatorShareService} from "ng-navigator-share";
import {get_nfluent_wallet_url, init_visuels} from "../../nfluent";
import {extract_bank_from_param} from "../../crypto";

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
  name="";
  version=environment.version;
  infos="";
  miner: CryptoKey | undefined;
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
  background="";
  joinDoc: string=""
  photographer="Anonyme";
  promo="";
  promofile="";
  show_last_step: boolean=false;
  price: number=0;
  fiat_price:number=0;
  configs: string[]=[];
  border="2%";
  size="100%";
  new_account_mail=environment.appli+"/assets/wallet_access.html";
  existing_account_mail=environment.appli+"/assets/existing_account_wallet_access.html";
  bank:Bank | undefined=environment.bank;
  royalties: number=0;
  visual="";
  network: string="";
  config: string = "";
  params: any;
  intro: any;
  slide: number=1
  step=0
  connexion: Connexion={
    xAlias: false,
    address: false,
    direct_connect: false,
    email: false,
    extension_wallet: true,
    google: false,
    keystore: false,
    nfluent_wallet_connect: false,
    on_device: false,
    private_key: false,
    wallet_connect: true,
    web_wallet: false,
    webcam: false
  }
  isDevnet=false;


  public constructor(
    public router:Router,
    public api:NetworkService,
    public routes:ActivatedRoute,
    public toast:MatSnackBar,
    public ngShare:NgNavigatorShareService,
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
    this.photo = $event;
    this.preview()
  }


  preview(limit=10) {
    let seed=Math.round(Math.random()*100);
    $$("On récupére une première image et la taille de la sequences")
    this.visuels=[];
    if(!this.photo || this.name=="")return;
    this.api.send_photo_for_nftlive(
      limit,this.config, this.nft_size.toString(),
      80,"",[{name:"title", value:this.name}],
      {photo:this.photo}, "base64").subscribe((result:any)=>{
      this.visuels=init_visuels(result.images);
      if(this.visuels.length>0){
        this.sel_visuel=this.visuels[0];
        if(this.step==0)this.step=1
      }

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
      this.photo=undefined;
      showError(this,err);
      wait_message(this);
    })
  }

  restart() {
    this.sel_visuel=undefined;
    this.url_wallet="";
    this.name="";
    this.url_gallery="";
    this.dests="";
    this.visuels=[];
    this.photo=undefined;
  }

  async read_param() {
    //Lecture des paramétres
    let params: any = await getParams(this.routes);
    $$("Lecture des parametres ", params)
    if(params.bank){
      this.bank=params.bank;
    } else {
      this.bank=extract_bank_from_param(params) || environment.bank;
    }

    apply_params(this,params,environment)

    this.params=params;

    this.stockage = params.stockage || environment.stockage.stockage
    this.stockage_document = params.stockage_document || environment.stockage.stockage_document
    this.api_key_document=params.api_key_document || ""

    let collection_name=params.collection || environment.nftlive.collection
    if(collection_name && this.miner)this.collection = newCollection(collection_name, this.miner)

    this.merchant=extract_merchant_from_param(params) || environment.merchant;

    this.promo=params.promotion || ""
    this.promofile=params.promolink || ""

    this.royalties=params.royalties || environment.nftlive.royalties || 0
    this.royalties=Number(this.royalties.toString().replace("%",""))
    if(this.royalties>0 && this.royalties<1)this.royalties=this.royalties*100;

    this.price=params.price || environment.nftlive.crypto_price
    this.fiat_price=params.fiat_price || environment.nftlive.fiat_price

    if(params.configs && typeof(params.configs)=="string")params.configs=params.configs.split(",")
    this.configs=params.configs || [environment.appli+"/assets/config_nftlive.yaml"]
    this.config=params.config || this.configs[0];

    this.photographer=localStorage.getItem("photographer") || "Anonyme";
    this.dests=params.address || params.miner || ""

    if(params.photo)this.photo={file:params.photo}
    this.name=params.title || params.name || ""
    if(this.photo!="" && this.name!="")this.preview(5)

    this.isDevnet=(detect_type_network(this.network)=="devnet")
  }

  return_error(){
    wait_message(this);
    showMessage(this,"Incident technique, veuillez recommencer");
  }

  async ask_for_mint(){
    if(!this.dests){
      this.dests=this.user.addr;
      if(this.dests=='')showMessage(this,"Indiquez l'adresse du destinataire ou connectez vous pour recevoir le NFT")
    }
    this.save_local();
    let rep:any={}
    if(this.merchant){
      rep=await _ask_for_paiement(this,
        this.merchant!.wallet!.token,
        this.price,
        this.fiat_price,
        this.merchant!,
        this.user.wallet_provider,
        "Frais de fabrication et d'enregistrement du NFT",
        "",
        "",
        "",{contact: "", description: "", subject: ""},"",this.bank)
    }else{
      if(!this.user.wallet_provider){
        showMessage(this,"Vous devez vous connecter pour fabriquer le NFT")
        this.step=3
        return;
      } else {
        rep={address:this.dests,data:{provider:this.user.wallet_provider}}
      }
    }
    if(rep){
      if(rep.address && rep.data)this.user.init_wallet_provider(rep.data.provider,rep.address)
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
      if(this.miner && this.miner?.encrypt=="")this.miner=undefined
      let idx=0;
      for(let address of this.dests.split(' ')){
        if(address.indexOf("@")>-1){
          wait_message(this,"Création d'un wallet pour "+address);
        } else {
          wait_message(this,"Préparation de la fabrication du NFT")
        }

        this.api.create_account(
          this.network, address,
          this.new_account_mail,
          this.existing_account_mail,{},false,"Création d'un compte pour votre NFT"
        ).subscribe(async (account:any)=> {
          wait_message(this,"Fabrication du NFT");
          let owner=account.address
          $$("Minage pour le compte "+owner)

          this.api.upload(this.photo.file,this.stockage_document,this.api_key_document).subscribe(async (file:any)=>{
            let files=(this.joinDoc=="checked") ? [file] : [];

            if(this.photographer.length==0)this.photographer=owner;
            let attributes=[
              {trait_type:"Prise de vue",value:now("datetime")},
              {trait_type:"Photographe",value:this.photographer}
            ]

            if(this.promo.length>0){
              if(this.promo.indexOf("=")==-1){
                attributes.push({trait_type:"Evénement",value:this.promo});
              }else{
                for(let prop of this.promo.split("\n")){
                  attributes.push({
                    trait_type: prop.split("=")[0],
                    value:prop.split("=")[1]
                  })
                }
              }

            }
            if(this.promofile.length>0)files.push(this.promofile);

            $$("Mise en ligne des attributs sur "+this.stockage)
            this.api.upload(this.sel_visuel.data.src,this.stockage).subscribe(async (addr_visual:any)=>{
              let creator_address=this.miner ? this.miner.address : ""
              let nft:NFT={
                type: this.max_supply==1 ? "NonFungible" : "SemiFungible",
                address: undefined,
                attributes: attributes,
                collection: this.collection,
                creators: [{address:creator_address,share:100,verified:true}],
                description: this.infos,
                files: files,
                links: undefined,
                supply:this.max_supply,
                price: 0,
                message: undefined,
                miner: this.miner || this.user.addr,
                name: this.name,
                network: this.network,
                owner: owner,
                royalties: 0,
                solana: undefined,
                style: undefined,
                symbol: "NFTLive NFT #"+idx,
                tags: "NFTLive",
                visual: addr_visual.url,
                balances:{}
              }
              $$("Minage du NFT attribué a "+account.address,nft)
              idx=idx+1;

              $$("Minage du nft ",nft)

              try{
                let t_minage:any=await this.api.mint(nft,owner,"",true,this.stockage,this.network)
                t_minage=await this.api.execute(t_minage,this.network,this.miner || this.user.wallet_provider)

                wait_message(this);
                if(t_minage.error==""){
                  if(isEmail(address))showMessage(this,"Consulter votre mail "+address+" pour retrouver votre NFT")
                  this.url_wallet=get_nfluent_wallet_url(owner,this.network,environment.wallet);
                  this.url_gallery=t_minage.link_nft_gallery;
                } else {
                  showMessage(this,"Probleme technique "+t_minage.error)
                }
              }catch (e){
                $$("Erreur de minage ",e)
                wait_message(this)
                showMessage(this,"Problème de fabrication du NFT, veuillez recommencer l'opération")
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

  save_local(){
    localStorage.setItem("dests",this.dests)
    localStorage.setItem("photograher",this.photographer)
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
    this.dests=event.address
  }


  logout() {
    showMessage(this,"Déconnexion de votre compte");
    this.user.logout()
  }

  open_about() {
    this.router.navigate(["about"])
  }

  more_model() {
    let pos=this.configs.indexOf(this.config)+1;
    if(pos==this.configs.length)pos=0;
    this.config=this.configs[pos];
    this.preview();
  }


  open_share() {
    this.ngShare.share({
      title:this.params.appname,
      text:this.params.claim,
      url:this.router.url
    })
  }

  remove_bg() {
    wait_message(this,"Suppression du fond")
    this.api.remove_background(this.photo).subscribe({next:(r)=>{
        wait_message(this)
        this.photo.fileangular=r.image;
      },error:(err)=>{showError(this,err)}})
  }

  select_collection($event: Collection) {
    this.collection=$event
  }

  end_search_collection(cols: Collection[]) {
    if(cols.length==0){
      showMessage(this,"Vous devez créer une collection pour héberger votre NFT sur la blockchaine")
      this.collection=undefined
    }
  }

  change_step(step: number) {
    this.step=step
  }
}
