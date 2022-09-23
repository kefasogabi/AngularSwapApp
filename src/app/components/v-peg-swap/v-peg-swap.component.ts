import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Web3Service } from 'src/app/services/contract/web3.service';
import truncateEthAddress from 'truncate-eth-address'
import Web3 from 'web3';
import { provider } from 'web3-core';
import vSwapContract from "../../../assets/contracts/vswap.json";

@Component({
  selector: 'app-v-peg-swap',
  templateUrl: './v-peg-swap.component.html',
  styleUrls: ['./v-peg-swap.component.css']
})
export class VPegSwapComponent implements OnInit {

  authenticated: boolean = false;
  data: string = "";
  balance: string = "";
  account: any[] = [];
  inputSelect:string ="";
  tokens: { logo: string, name: string }[] = [];

  /////////
  web3js:  any;
  provider: provider | undefined;
  ////////
  vSwapForm: FormGroup;
  logoFrom:string = "assets/images/BUSD_LOGO.png";
  logoTo:string = "";

  tokenFrom:string = "BUSD";
  tokenTo:string = "";



  error_messages = {

    'from': [
      { type: 'required', message: 'Amount is required.' }
    ],
    'to': [
      { type: 'required', message: 'Gender is required.' }
    ]
  }
  constructor(private web3: Web3Service, private formBuilder: FormBuilder) {
     this.tokens = [
        { "logo": "assets/images/BUSD_LOGO.png", "name": " BUSD" },
        { "logo": "assets/images/DAI_LOGO.png", "name": " DAI" },
        { "logo": "assets/images/USDT_LOGO.png", "name": " USDT" }
    ];

    this.vSwapForm = this.formBuilder.group({
      from: new FormControl('', Validators.compose([
        Validators.required
      ])),
      to: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });

   }

  ngOnInit(): void {
    this.Connect();
    this.connectWeb3();
  }

  Connect() {
    this.web3.connectAccount().then((response:any) => {
      this.account = response;
      this.data = truncateEthAddress(response[0]);
      this.authenticated = true;
      this.web3.accountInfo(response[0]).then((res: any) => {
        this.balance = res;
        console.log(res);
      })
    })
  }

   connectWeb3(){
    this.web3.connectWeb3().then((response:any)=>{
      this.web3js = response;

      var networkId = this.web3js.eth.net.getId();
      const networkType = this.web3js.eth.net.getNetworkType();
      const instance = new this.web3js.eth.Contract(vSwapContract, "0x69A16A5c7668FEF080a38fc589ECFAFDc6B3873F");

    })
  }

  swapToken(){
    console.log(this.vSwapForm.value);
  }

  SelectedToken(value:any, selected:any, inputSelectLogo:any){
    console.log(value, selected);

    if(selected == "FROM"){
      this.tokenFrom = value;
      this.logoFrom = inputSelectLogo;
    }else{
      this.tokenTo = value;
      this.logoTo = inputSelectLogo;
    }
  }

  selected(value:any){
    this.inputSelect = value;
  }
}
