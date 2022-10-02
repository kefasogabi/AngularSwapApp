import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Web3Service } from 'src/app/services/contract/web3.service';
import truncateEthAddress from 'truncate-eth-address'
import Web3 from 'web3';
import { provider } from 'web3-core';
import vStakeContract from "../../../assets/contracts/vstakeAbi.json";
import BUSDContract from "../../../assets/contracts/BNB.json";

@Component({
  selector: 'app-v-stake',
  templateUrl: './v-stake.component.html',
  styleUrls: ['./v-stake.component.css']
})
export class VStakeComponent implements OnInit {

  authenticated: boolean = false;
  data: string = "";
  balance: string = "";
  value:any;
  account: any[] = [];

  /////////
  web3js:  any;
  provider: provider | undefined;
  ////////
  vStakeForm: FormGroup;
  BUSDLOGO:string = "assets/images/BUSD_LOGO.png";
  WBNBLOGO:string = "assets/images/WBNB.png";
  contractAddress:string = "0xe069c797ab330EB3362743e3E25225E47bE98122";



  error_messages = {

    'amount': [
      { type: 'required', message: 'Amount is required.' }
    ]
  }
  constructor(private web3: Web3Service, private formBuilder: FormBuilder) {


    this.vStakeForm = this.formBuilder.group({
      amount: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });

   }

  ngOnInit(): void {
    this.Connect();
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

  toStakeorUnstate(value:any){
    this.value = value;
  }



  stakeToken(account:any, value:any){

    this.web3.connectWeb3().then((response:any)=>{
      this.web3js = response;

      var networkId = this.web3js.eth.net.getId();
      const networkType = this.web3js.eth.net.getNetworkType();
      const instance = new this.web3js.eth.Contract(vStakeContract, "0xe069c797ab330EB3362743e3E25225E47bE98122");
      const approveInstanceAddress = new this.web3js.eth.Contract(BUSDContract, "0x9f0227a21987c1ffab1785ba3eba60578ec1501b");

      let convertToWei = this.web3js.utils.toWei(this.vStakeForm.value.amount, 'Ether');

console.log(convertToWei);


      if(value == "STAKE"){
        approveInstanceAddress.methods
        .approve("0xe069c797ab330EB3362743e3E25225E47bE98122", convertToWei)
        .send({ from: account })
        .on('transactionHash', (hash:any) => {

        }).on('receipt', (receipt:any) => {
          instance.methods
          .deposit(convertToWei)
          .send({ from: account });
        });
      }else{
        instance.methods
        .withdraw(convertToWei)
        .send({ from: account });
      }


    })


  }
}
