import { Component } from '@angular/core';
import {getParams} from "../tools";
import {NetworkService} from "./network.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NFTLive';

  constructor(
      public routes:ActivatedRoute,
      public router:Router,
      public network:NetworkService
  ) {
  }

  ngOnInit(): void {
    getParams(this.routes).then((params:any)=>{
      if(params.hasOwnProperty("server"))this.network.server_nfluent=params.server;
      if(params.go){
        this.router.navigate([params.go]);
      }
    })
  }

}
