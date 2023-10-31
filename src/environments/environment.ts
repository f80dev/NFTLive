// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {newCryptoKey} from "../tools";

export const environment = {
    production: false,
    forum:"",
    mail:"contact@nfluent.io",
    version: "0.1 dev",
    server:"http://127.0.0.1:4242",
    appname:"NFT live",
    visual:"https://images.unsplash.com/photo-1573152958734-1922c188fba3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
    style:"nfluent-dark.css",
    splash_visual:"./assets/forge.jpg",
    claim:"Transformer vos photos en NFT instantanément",
    appli:"https://nftlive.nfluent.io",
    wallet:"http://127.0.0.1:4200",
    website:"https://nfluent.io",
    faqs:"{{domain_appli}}/assets/faqs.yaml",
  company:"nfluent",
  network:"elrond-devnet",

    stockage:{
        stockage_document: "infura",
        stockage:"nftstorage",
    },

    nftlive:{
        crypto_price:1,
        fiat_price:0.5,
        miner_key:"dan: Z0FBQUFBQmtJVXd6UTNFdE9sUzQ4djhwdjEzZ0NzSnF3cG5odXpyLTVGRURpUFJoU3V5YTZHbzFJMC1QVkNPbFpkV2I0TkVBcDVfNHVKWVNqMHo3UkxVc0QwRjRzVTIwbHA2Q0pGWnFXdWhqTThYSTJOdjhpSkhjZnZjMzZ2RDFORm84b0J6MDMwbDUyQ0JFMzNwemIxTlc4b0UxcTdXOXF5RDREYU5TTl9lbVMzV18zYWpmMkp1ZFpPcEw4N1pwVUVzVTc2NUVBTmFoZGJ6SldSMko3bHNfSnd4MEctbF9HWnVORmJIeTFneGppSGU0d0FSNnZjeWswelE5QkFoaWRqWktQb09SUGxxRXhOSFRxQUdxbmVEV0s4Tk83QlJSMUJSRzlfakhlSW1leEk1MmVVV3V6dFZfb1JrT0VhY3FrMzVCM3QxNDBXZTc3X1VvRXNJWFBGUmtadkZlSG1WQVVBPT0=",
        collection: "SEMICOLL-9cf014",
        royalties: 0
    },

    bank:{
        miner: newCryptoKey("","","","nfluent: Z0FBQUFBQmtYUjJVbS1Uc0lpa2FTR2F0SnF4LW1HUHIzbHFKN2hCVmRPN3NRR1R3Wk4tUnhfcUxqUE9IQVdObzMxMHgtazhrT1hpWXVndENZallGNnI1Q2RTLVQ1N2d0TEQ2dHNmVlByV3B0RlR3SUMxejhKMHZUeVJ3NHl6dnNFNEIyZWk2eGZsS1hWU2FuQnljcGRDUEh4WFhSMTBRTFFLdHkxeTJuUjZxYWRRc1dVN2FqYlZzPQ=="),
        title:"Bienvenu a la banque des NFluCoin",
        refund:5,
        token:"NFLUCOIN-4921ed",
        network:"elrond-devnet",
        wallet_limit: 10,
      limit:3,
      collection:"",
        histo:"db-server-nfluent",
    },

    // merchant:{
    //     id:"BCR2DN4TYD4Z5XCR",
    //     name:"NFluenT",
    //     currency:"EUR",
    //     country:"FR",
    //     contact:"contact@nfluent.io",
    //     wallet:
    //         {
    //             token:"NFLUCOIN-4921ed",
    //             address:"erd1gkd6f8wm79v3fsyyklp2qkhq0eek28cnr4jhj9h87zwqxwdz7uwstdzj3m",
    //             network:"elrond-devnet",
    //             unity: "NfluCoint",
    //             bank: "nfluent: Z0FBQUFBQmtYUjJVbS1Uc0lpa2FTR2F0SnF4LW1HUHIzbHFKN2hCVmRPN3NRR1R3Wk4tUnhfcUxqUE9IQVdObzMxMHgtazhrT1hpWXVndENZallGNnI1Q2RTLVQ1N2d0TEQ2dHNmVlByV3B0RlR3SUMxejhKMHZUeVJ3NHl6dnNFNEIyZWk2eGZsS1hWU2FuQnljcGRDUEh4WFhSMTBRTFFLdHkxeTJuUjZxYWRRc1dVN2FqYlZzPQ==",
    //             title:"La banque de NFluent",
    //             refund: 5
    //         }
    // }
    merchant: undefined

};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
