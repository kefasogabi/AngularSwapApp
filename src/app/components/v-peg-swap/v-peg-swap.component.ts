import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Web3Service } from 'src/app/services/contract/web3.service';
import truncateEthAddress from 'truncate-eth-address'
import Web3 from 'web3';
import { provider } from 'web3-core';
import vPegSwapContract from "../../../assets/contracts/vPegSwapContract.json";
import BUSDContract from "../../../assets/contracts/BNB.json";
import DAIContract from "../../../assets/contracts/BSC.json";
// import FORMULAContract from "../../../assets/contracts/Formula.json";

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
  tokens: { logo: string, name: string, addresss:string, index: number }[] = [];

  /////////
  web3js:  any;
  provider: provider | undefined;
  ////////
  vSwapForm: FormGroup;
  logoFrom:string = "assets/images/BUSD_LOGO.png";
  logoTo:string = "";


  tokenFrom:string = "BUSD";
  tokenTo:string = "";

  addressFrom:string = "0x9f0227a21987c1ffab1785ba3eba60578ec1501b";
  addressTo:string = "";

  indexTo:number = 1;
  indexFrom:number = 0;

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
        { "logo": "assets/images/BUSD_LOGO.png", "name": " BUSD", "addresss": "0x9f0227a21987c1ffab1785ba3eba60578ec1501b", "index": 0 },
        { "logo": "assets/images/DAI_LOGO.png", "name": " DAI", "addresss": "0x10249e900b919fdee9e2ed38b4cd83c4df857254", "index":1 }
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
      // const FORMULAInstance = new this.web3js.eth.Contract(FORMULAContract, "0xc6c5E3779342Ae82EEAD779C45DB1c99557Cb7d1");

      // let convertToWei = this.web3js.utils.toWei(this.vSwapForm.value.from, 'Ether');

      // let res = FORMULAInstance.methods
      //   .getAmountsOut(fromAddress, toAddress, convertToWei, ["0x09fd82D68B231A162d4f8f1931C850fccF30F97A"])
      //   .call().then( (k:any) => { this.vSwapForm.get('to')?.setValue(this.web3js.utils.fromWei(k[1] , 'ether')); });



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



  swapToken(indexFrom:any, indexTo:any, account:any){

    this.web3.connectWeb3().then((response:any)=>{
      this.web3js = response;

      var networkId = this.web3js.eth.net.getId();
      const networkType = this.web3js.eth.net.getNetworkType();
      const instance = new this.web3js.eth.Contract(vPegSwapContract, "0x7F6573c4E4Bd53075e3A06A3d625b4c901BDB8cC");
      const BUSDInstance = new this.web3js.eth.Contract(BUSDContract, "0x9f0227a21987c1ffab1785ba3eba60578ec1501b");
      const DAIInstance = new this.web3js.eth.Contract(DAIContract, "0x10249e900b919fdee9e2ed38b4cd83c4df857254");
      // const FORMULAInstance = new this.web3js.eth.Contract(FORMULAContract, "0xc6c5E3779342Ae82EEAD779C45DB1c99557Cb7d1");

      let approveInstance:any;
      let approveInstanceAddress:any;
      if(indexFrom == 0){
        approveInstance = BUSDInstance;
        // approveInstanceAddress = addressFrom;
        indexTo = 1
        indexFrom = 0
      }else{
        approveInstance = DAIInstance;
        // approveInstanceAddress = addressTo;
        indexTo = 0;
        indexFrom = 1;
      }

      console.log(instance);

      let convertToWei = this.web3js.utils.toWei(this.vSwapForm.value.from, 'Ether');
      var data = {
        tokenIndexFrom: indexFrom,
        tokenIndexTo: indexTo,
        dx: convertToWei,
        minDy: 0,
        deadline: Math.floor(new Date().getTime()/1000.0) + 600
      }

      console.log(data)
      approveInstance.methods
      .approve("0x7F6573c4E4Bd53075e3A06A3d625b4c901BDB8cC", convertToWei)
      .send({ from: account })
      .on('transactionHash', (hash:any) => {

      }).on('receipt', (receipt:any) => {
        instance.methods
        .swap(data.tokenIndexFrom, data.tokenIndexTo, data.dx, data.minDy, data.deadline)
        .send({ from: account });
      });
    })


  }

  SelectedToken(value:any, selected:any, inputSelectLogo:any, address:any, index:number){
    console.log(value, selected);

    if(selected == "FROM"){
      this.tokenFrom = value;
      this.logoFrom = inputSelectLogo;
      this.addressFrom = address;
      this.indexFrom = index;
    }else{
      this.tokenTo = value;
      this.logoTo = inputSelectLogo;
      this.addressTo = address;
      this.indexTo = index;
    }

    this.vSwapForm.get('from')?.setValue("");
    this.vSwapForm.get('to')?.setValue("");
  }

  selected(value:any){

    this.inputSelect = value;
  }
}
