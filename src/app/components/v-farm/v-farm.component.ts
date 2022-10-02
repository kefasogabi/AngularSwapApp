import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Web3Service } from 'src/app/services/contract/web3.service';
import truncateEthAddress from 'truncate-eth-address'
import Web3 from 'web3';
import { provider } from 'web3-core';
import vFarmContract from "../../../assets/contracts/vFarmAbi.json";
import BUSDContract from "../../../assets/contracts/BNB.json";

@Component({
  selector: 'app-v-farm',
  templateUrl: './v-farm.component.html',
  styleUrls: ['./v-farm.component.css']
})
export class VFarmComponent implements OnInit {

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
      const instance = new this.web3js.eth.Contract(vFarmContract, "0x654ABd04dD9fDd30184E09F0c948Fc8A1f648540");
      const approveInstanceAddress = new this.web3js.eth.Contract(BUSDContract, "0x67a7A2363e5387E6989B9b3f338AB0E009f7C025");

      let convertToWei = this.web3js.utils.toWei(this.vStakeForm.value.amount, 'Ether');


      if(value == "STAKE"){
        approveInstanceAddress.methods
        .approve("0x654ABd04dD9fDd30184E09F0c948Fc8A1f648540", convertToWei)
        .send({ from: account })
        .on('transactionHash', (hash:any) => {

        }).on('receipt', (receipt:any) => {
          instance.methods
          .deposit(0,convertToWei)
          .send({ from: account });
        });
      }else{
        instance.methods
        .withdraw(0,convertToWei)
        .send({ from: account });
      }


    })


  }

}
