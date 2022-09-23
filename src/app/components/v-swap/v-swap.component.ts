import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Web3Service } from 'src/app/services/contract/web3.service';
import truncateEthAddress from 'truncate-eth-address'
import Web3 from 'web3';
import { provider } from 'web3-core';
import vSwapContract from "../../../assets/contracts/vswap.json";
import BNBContract from "../../../assets/contracts/BNB.json";
import BSCContract from "../../../assets/contracts/BSC.json";
import FORMULAContract from "../../../assets/contracts/Formula.json";

@Component({
  selector: 'app-v-swap',
  templateUrl: './v-swap.component.html',
  styleUrls: ['./v-swap.component.css']
})
export class VSwapComponent implements OnInit {
  authenticated: boolean = false;
  data: string = "";
  balance: string = "";
  account: any[] = [];
  inputSelect:string ="";
  tokens: { logo: string, name: string, addresss:string }[] = [];

  /////////
  web3js:  any;
  provider: provider | undefined;
  ////////
  vSwapForm: FormGroup;
  logoFrom:string = "assets/images/BTC_LOGO.png";
  logoTo:string = "";

  tokenFrom:string = "BNB";
  tokenTo:string = "";

  addressFrom:string = "0x95c8F90aE3f1BBf4C7896A1643acCe5BBe2B0609";
  addressTo:string = "";

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
        { "logo": "assets/images/BTC_LOGO.png", "name": " BNB", "addresss": "0x95c8F90aE3f1BBf4C7896A1643acCe5BBe2B0609" },
        { "logo": "assets/images/BSC-logo.svg", "name": " BSC", "addresss": "0xeC2dA8246a880C28D4476F1CB8204310e9988af5" }
        // { "logo": "assets/images/ETH_LOGO.png", "name": " ETH", "addresss": "" }
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
  }

  getExchangeRate(fromAddress:any, toAddress:any){
    this.web3.connectWeb3().then((response:any)=>{
      this.web3js = response;
      const FORMULAInstance = new this.web3js.eth.Contract(FORMULAContract, "0xc6c5E3779342Ae82EEAD779C45DB1c99557Cb7d1");

      let convertToWei = this.web3js.utils.toWei(this.vSwapForm.value.from, 'Ether');

      let res = FORMULAInstance.methods
        .getAmountsOut(fromAddress, toAddress, convertToWei, ["0x09fd82D68B231A162d4f8f1931C850fccF30F97A"])
        .call().then( (k:any) => { this.vSwapForm.get('to')?.setValue(this.web3js.utils.fromWei(k[1] , 'ether')); });



    })
  }

  Connect() {
    this.web3.connectAccount().then((response:any) => {
      this.account = response[0];
      this.data = truncateEthAddress(response[0]);
      this.authenticated = true;
      this.web3.accountInfo(response[0]).then((res: any) => {
        this.balance = res;
        console.log(res);
      })
    })
  }



  swapToken(addressFrom:any, addressTo:any, account:any){

    this.web3.connectWeb3().then((response:any)=>{
      this.web3js = response;

      var networkId = this.web3js.eth.net.getId();
      const networkType = this.web3js.eth.net.getNetworkType();
      const instance = new this.web3js.eth.Contract(vSwapContract, "0x69A16A5c7668FEF080a38fc589ECFAFDc6B3873F");
      const BNBInstance = new this.web3js.eth.Contract(BNBContract, "0x95c8F90aE3f1BBf4C7896A1643acCe5BBe2B0609");
      const BSCInstance = new this.web3js.eth.Contract(BSCContract, "0xeC2dA8246a880C28D4476F1CB8204310e9988af5");
      const FORMULAInstance = new this.web3js.eth.Contract(FORMULAContract, "0xc6c5E3779342Ae82EEAD779C45DB1c99557Cb7d1");

      let approveInstance:any;
      let approveInstanceAddress:any;
      if(addressFrom == "0x95c8F90aE3f1BBf4C7896A1643acCe5BBe2B0609"){
        approveInstance = BNBInstance;
        approveInstanceAddress = addressFrom;
      }else{
        approveInstance = BSCInstance;
        approveInstanceAddress = addressTo;
      }

      console.log(approveInstance);

      let convertToWei = this.web3js.utils.toWei(this.vSwapForm.value.from, 'Ether');
      var data = {
        tokenIn: addressFrom,
        tokenOut: addressTo,
        amountIn: convertToWei,
        amountOutMin: "0",
        path: ["0x09fd82D68B231A162d4f8f1931C850fccF30F97A"],
        to: account,
        deadline: Math.floor(new Date().getTime()/1000.0) + 600
      }

      console.log(data)
      approveInstance.methods
      .approve(data.path[0], convertToWei)
      .send({ from: account })
      .on('transactionHash', (hash:any) => {

      }).on('receipt', (receipt:any) => {
        instance.methods
        .swapExactTokensForTokens(data.tokenIn, data.tokenOut, data.amountIn, data.amountOutMin, data.path, data.to, data.deadline)
        .send({ from: account });
      });
    })


  }

  SelectedToken(value:any, selected:any, inputSelectLogo:any, address:any){
    console.log(value, selected);

    if(selected == "FROM"){
      this.tokenFrom = value;
      this.logoFrom = inputSelectLogo;
      this.addressFrom = address;
    }else{
      this.tokenTo = value;
      this.logoTo = inputSelectLogo;
      this.addressTo = address;
    }

    this.vSwapForm.get('from')?.setValue("");
    this.vSwapForm.get('to')?.setValue("");
  }

  selected(value:any){

    this.inputSelect = value;
  }

}
