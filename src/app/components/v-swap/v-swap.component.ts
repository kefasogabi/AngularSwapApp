import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Web3Service } from 'src/app/services/contract/web3.service';
import truncateEthAddress from 'truncate-eth-address'
import Web3 from 'web3';
import { provider } from 'web3-core';
import vSwapContract from "../../../assets/contracts/vswap.json";
import BNBContract from "../../../assets/contracts/BNB.json";
import BUSDContract from "../../../assets/contracts/BUSD.json";
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
  addressFrom:string = "0x2383F69a911Bc80afCaeeFB5B67649D1A078Cae7";
  addressTo:string = "";

  ////// for pool ///////
  currentTab:any = 'SWAP';
  vPoolForm: FormGroup;
  poollogoFrom:string = "assets/images/BTC_LOGO.png";
  poollogoTo:string = "assets/images/BSC-logo.svg";
  pooltokenFrom:string = "BNB";
  pooltokenTo:string = "BUSD";
  pooladdressFrom:string = "0x2383F69a911Bc80afCaeeFB5B67649D1A078Cae7";
  pooladdressTo:string = "0x33D54e2E33C5a1BBBbBdd51A6668af4dC4465ff8";
  poolinputSelect:string ="";
  pooltokens: { logo: string, name: string, addresss:string }[] = [];
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
        { "logo": "assets/images/BTC_LOGO.png", "name": " BNB", "addresss": "0x2383F69a911Bc80afCaeeFB5B67649D1A078Cae7" },
        { "logo": "assets/images/BSC-logo.svg", "name": " BUSD", "addresss": "0x33D54e2E33C5a1BBBbBdd51A6668af4dC4465ff8" }
    ];

    this.pooltokens = [
      { "logo": "assets/images/BSC-logo.svg", "name": " BUSD", "addresss": "0x33D54e2E33C5a1BBBbBdd51A6668af4dC4465ff8" }
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
    this.vSwapForm.get('to')?.setValue("");
    this.web3.connectWeb3().then((response:any)=>{
      this.web3js = response;
      const FORMULAInstance = new this.web3js.eth.Contract(FORMULAContract, "0xd4d4c0b8868A81D12FE55bBdF37edB8e04eF9BF6");

      let convertToWei = this.web3js.utils.toWei(this.vSwapForm.value.from, 'Ether');

      let res = FORMULAInstance.methods
        .getAmountsOut(fromAddress, toAddress, convertToWei, ["0x67a7A2363e5387E6989B9b3f338AB0E009f7C025"])
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
      const instance = new this.web3js.eth.Contract(vSwapContract, "0xB3A480f233A807534821c34480fb0bdacf4277a8");
      const BNBInstance = new this.web3js.eth.Contract(BNBContract, "0x2383F69a911Bc80afCaeeFB5B67649D1A078Cae7");
      const BSCInstance = new this.web3js.eth.Contract(BUSDContract, "0x33D54e2E33C5a1BBBbBdd51A6668af4dC4465ff8");
      const FORMULAInstance = new this.web3js.eth.Contract(FORMULAContract, "0xd4d4c0b8868A81D12FE55bBdF37edB8e04eF9BF6");

      let approveInstance:any;
      let approveInstanceAddress:any;
      if(addressFrom == "0x2383F69a911Bc80afCaeeFB5B67649D1A078Cae7"){
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
        path: ["0x67a7A2363e5387E6989B9b3f338AB0E009f7C025"],
        to: account,
        deadline: Math.floor(new Date().getTime()/1000.0) + 600
      }

      console.log(data)
      if (data.tokenIn != "0x2383F69a911Bc80afCaeeFB5B67649D1A078Cae7" ) {
        approveInstance.methods
        .approve("0xB3A480f233A807534821c34480fb0bdacf4277a8", convertToWei)
        .send({ from: account })
        .on('transactionHash', (hash:any) => {

        }).on('receipt', (receipt:any) => {
          console.log({data})
          instance.methods
          .swapExactTokensForETH(data.tokenIn, data.amountIn, data.amountOutMin, data.path, data.to, data.deadline)
          .send({ from: account });
        });
      } else {
        let vlue:string = this.vSwapForm.value.from;

        instance.methods
          .swapExactETHForTokens( data.tokenOut, data.amountOutMin, data.path, data.to, data.deadline)
          .send({ from: account, value: convertToWei, });
      }
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

  ///// Method for pooooll //////

  poolgetExchangeRate(fromAddress:any, toAddress:any){
    this.vPoolForm.get('to')?.setValue("");
    this.web3.connectWeb3().then((response:any)=>{
      this.web3js = response;
      const FORMULAInstance = new this.web3js.eth.Contract(FORMULAContract, "0xd4d4c0b8868A81D12FE55bBdF37edB8e04eF9BF6");

      let convertToWei = this.web3js.utils.toWei(this.vPoolForm.value.from, 'Ether');

      let res = FORMULAInstance.methods
        .getAmountsOut(fromAddress, toAddress, convertToWei, ["0x67a7A2363e5387E6989B9b3f338AB0E009f7C025"])
        .call().then( (k:any) => { this.vPoolForm.get('to')?.setValue(this.web3js.utils.fromWei(k[1] , 'ether')); });



    })
  }

  poolSelectedToken(value:any, selected:any, inputSelectLogo:any, address:any){
    console.log(value, selected);

    if(selected == "FROM"){
      this.pooltokenFrom = value;
      this.poollogoFrom = inputSelectLogo;
      this.pooladdressFrom = address;
    }else{
      this.pooltokenTo = value;
      this.poollogoTo = inputSelectLogo;
      this.pooladdressTo = address;
    }

    this.vPoolForm.get('from')?.setValue("");
    this.vPoolForm.get('to')?.setValue("");
  }

  poolselected(value:any){

    this.poolinputSelect = value;
  }

  switch(value:any){
    this.currentTab = value
  }

  poolswapToken(addressFrom:any, addressTo:any, account:any){

    this.web3.connectWeb3().then((response:any)=>{
      this.web3js = response;

      var networkId = this.web3js.eth.net.getId();
      const networkType = this.web3js.eth.net.getNetworkType();
      const instance = new this.web3js.eth.Contract(vSwapContract, "0xB3A480f233A807534821c34480fb0bdacf4277a8");
      const BNBInstance = new this.web3js.eth.Contract(BNBContract, "0x2383F69a911Bc80afCaeeFB5B67649D1A078Cae7");
      const BSCInstance = new this.web3js.eth.Contract(BUSDContract, "0x33D54e2E33C5a1BBBbBdd51A6668af4dC4465ff8");
      const FORMULAInstance = new this.web3js.eth.Contract(FORMULAContract, "0xd4d4c0b8868A81D12FE55bBdF37edB8e04eF9BF6");

      let approveInstance:any;
      let approveInstanceAddress:any;
      if(addressFrom == "0x2383F69a911Bc80afCaeeFB5B67649D1A078Cae7"){
        approveInstance = BSCInstance;
        approveInstanceAddress = addressFrom;
      }else{
        approveInstance = BSCInstance;
        approveInstanceAddress = addressTo;
      }

      console.log(approveInstance);

      let convertToWei = this.web3js.utils.toWei(this.vPoolForm.value.from, 'Ether');
      var data = {
        tokenIn: addressFrom,
        tokenOut: addressTo,
        amountIn: convertToWei,
        amountOutMin: "0",
        path: ["0x67a7A2363e5387E6989B9b3f338AB0E009f7C025"],
        to: account,
        deadline: Math.floor(new Date().getTime()/1000.0) + 600
      }

      let convertFrom = this.web3js.utils.toWei(this.vPoolForm.value.from, 'Ether');
      let convertTo = this.web3js.utils.toWei(this.vPoolForm.value.to, 'Ether');

      console.log(data)
      if (data.tokenIn != "0x2383F69a911Bc80afCaeeFB5B67649D1A078Cae7" ) {
        approveInstance.methods
        .approve("0xB3A480f233A807534821c34480fb0bdacf4277a8", convertFrom)
        .send({ from: account })
        .on('transactionHash', (hash:any) => {

        }).on('receipt', (receipt:any) => {
          // if (data.tokenIn != "0x2383F69a911Bc80afCaeeFB5B67649D1A078Cae7" ) {
          instance.methods
          .addLiquidityETH(data.path[0], data.tokenIn, data.amountIn, data.amountOutMin,0, data.to, data.deadline)
          .send({value: convertTo, from: account });
        })
      } else {
        approveInstance.methods
        .approve("0xB3A480f233A807534821c34480fb0bdacf4277a8", convertTo)
        .send({ from: account })
        .on('transactionHash', (hash:any) => {

        }).on('receipt', (receipt:any) => {
          // if (data.tokenIn != "0x2383F69a911Bc80afCaeeFB5B67649D1A078Cae7" ) {
            instance.methods
            .addLiquidityETH(data.path[0], data.tokenOut, data.amountIn, data.amountOutMin,0, data.to, data.deadline)
            .send({value: convertFrom, from: account });
        })
      }
    })
  }

}
