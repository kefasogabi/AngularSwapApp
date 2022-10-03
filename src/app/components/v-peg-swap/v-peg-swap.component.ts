import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Web3Service } from 'src/app/services/contract/web3.service';
import truncateEthAddress from 'truncate-eth-address'
import Web3 from 'web3';
import { provider } from 'web3-core';
import vPegSwapContract from "../../../assets/contracts/vPegSwapContract.json";
import BUSDContract from "../../../assets/contracts/BNB.json";
import DAIContract from "../../../assets/contracts/BUSD.json";
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
  addressFrom:string = "0x33D54e2E33C5a1BBBbBdd51A6668af4dC4465ff8";
  addressTo:string = "";
  indexTo:number = 1;
  indexFrom:number = 0;

  ////// for pool ///////
  currentTab:any = 'SWAP';
  vPoolForm: FormGroup;
  poollogoFrom:string = "assets/images/BUSD_LOGO.png";
  poollogoTo:string = "assets/images/DAI_LOGO.png";
  pooltokenFrom:string = "BUSD";
  pooltokenTo:string = "DAI";
  pooladdressFrom:string = "0x33D54e2E33C5a1BBBbBdd51A6668af4dC4465ff8";
  pooladdressTo:string = "0x9A147C3c1663b9aba3545850119F8e93ecA52199";
  poolindexTo:number = 1;
  poolindexFrom:number = 0;
  poolinputSelect:string ="";
  pooltokens: { logo: string, name: string, addresss:string, index: number }[] = [];
  ///////////////////////

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
        { "logo": "assets/images/BUSD_LOGO.png", "name": " BUSD", "addresss": "0x33D54e2E33C5a1BBBbBdd51A6668af4dC4465ff8", "index": 0 },
        { "logo": "assets/images/DAI_LOGO.png", "name": " DAI", "addresss": "0x9A147C3c1663b9aba3545850119F8e93ecA52199", "index":1 }
        // { "logo": "assets/images/ETH_LOGO.png", "name": " ETH", "addresss": "" }
    ];

    this.pooltokens = [
      { "logo": "assets/images/DAI_LOGO.png", "name": " DAI", "addresss": "0x9A147C3c1663b9aba3545850119F8e93ecA52199", "index":1 }
  ];


    this.vSwapForm = this.formBuilder.group({
      from: new FormControl('', Validators.compose([
        Validators.required
      ])),
      to: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });

    this.vPoolForm = this.formBuilder.group({
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
      const instance = new this.web3js.eth.Contract(vPegSwapContract, "0x7e643d12d1DED2ACE9b238a65cd51ac5dE9e7318");
      const BUSDInstance = new this.web3js.eth.Contract(BUSDContract, "0x33D54e2E33C5a1BBBbBdd51A6668af4dC4465ff8");
      const DAIInstance = new this.web3js.eth.Contract(DAIContract, "0x9A147C3c1663b9aba3545850119F8e93ecA52199");

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
      .approve("0x7e643d12d1DED2ACE9b238a65cd51ac5dE9e7318", convertToWei)
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


  ///// Method for pooooll //////

  switch(value:any){
    this.currentTab = value
  }

  poolSelectedToken(value:any, selected:any, inputSelectLogo:any, address:any, index:number){
    console.log(value, selected);

    if(selected == "FROM"){
      this.pooltokenFrom = value;
      this.poollogoFrom = inputSelectLogo;
      this.pooladdressFrom = address;
      this.poolindexFrom = index;
    }else{
      this.pooltokenTo = value;
      this.poollogoTo = inputSelectLogo;
      this.pooladdressTo = address;
      this.poolindexTo = index;
    }

    this.vPoolForm.get('from')?.setValue("");
    this.vPoolForm.get('to')?.setValue("");
  }

  poolselected(value:any){

    this.poolinputSelect = value;
  }

  poolswapToken(indexFrom:any, indexTo:any, account:any){

    this.web3.connectWeb3().then((response:any)=>{
      this.web3js = response;

      var networkId = this.web3js.eth.net.getId();
      const networkType = this.web3js.eth.net.getNetworkType();
      const instance = new this.web3js.eth.Contract(vPegSwapContract, "0x7e643d12d1DED2ACE9b238a65cd51ac5dE9e7318");
      const BUSDInstance = new this.web3js.eth.Contract(BUSDContract, "0x33D54e2E33C5a1BBBbBdd51A6668af4dC4465ff8");
      const DAIInstance = new this.web3js.eth.Contract(DAIContract, "0x9A147C3c1663b9aba3545850119F8e93ecA52199");

      let approveInstanceAddress:any;
      if(indexFrom == 0){
        // approveInstanceAddress = addressFrom;
        indexTo = 1
        indexFrom = 0
      }else{
        // approveInstanceAddress = addressTo;
        indexTo = 0;
        indexFrom = 1;
      }

      console.log(instance);

      let convertToWei = this.web3js.utils.toWei(this.vPoolForm.value.from, 'Ether');
      var data = {
        tokenIndexFrom: indexFrom,
        tokenIndexTo: indexTo,
        dx: convertToWei,
        minDy: 0,
        deadline: Math.floor(new Date().getTime()/1000.0) + 600
      }

      console.log(data)
      BUSDInstance.methods
      .approve("0x7e643d12d1DED2ACE9b238a65cd51ac5dE9e7318", convertToWei)
      .send({ from: account })
      .on('transactionHash', (hash:any) => {

      }).on('receipt', (receipt:any) => {
        DAIInstance.methods
        .approve("0x7e643d12d1DED2ACE9b238a65cd51ac5dE9e7318", convertToWei)
        .send({ from: account })
        .on('transactionHash', (hash:any) => {

        }).on('receipt', (receipt:any) => {
          instance.methods
          .addLiquidity([convertToWei,convertToWei], 0, data.deadline)
          .send({ from: account });
        });
      });
    })


  }

  poolgetExchangeRate(fromAddress:any, toAddress:any){

    this.vPoolForm.get('to')?.setValue(this.vPoolForm.value.from);
    // this.web3.connectWeb3().then((response:any)=>{
    //   this.web3js = response;
    //   const FORMULAInstance = new this.web3js.eth.Contract(FORMULAContract, "0xc6c5E3779342Ae82EEAD779C45DB1c99557Cb7d1");

    //   let convertToWei = this.web3js.utils.toWei(this.vSwapForm.value.from, 'Ether');

    //   let res = FORMULAInstance.methods
    //     .getAmountsOut(fromAddress, toAddress, convertToWei, ["0x09fd82D68B231A162d4f8f1931C850fccF30F97A"])
    //     .call().then( (k:any) => { this.vSwapForm.get('to')?.setValue(this.web3js.utils.fromWei(k[1] , 'ether')); });



    // })
  }

}
