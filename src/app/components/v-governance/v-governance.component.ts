import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Web3Service } from 'src/app/services/contract/web3.service';
import truncateEthAddress from 'truncate-eth-address'
import Web3 from 'web3';
import { provider } from 'web3-core';
import vGovernanceContract from "../../../assets/contracts/VGovernance.json";
import BUSDContract from "../../../assets/contracts/BNB.json";

@Component({
  selector: 'app-v-governance',
  templateUrl: './v-governance.component.html',
  styleUrls: ['./v-governance.component.css']
})
export class VGovernanceComponent implements OnInit {

  authenticated: boolean = false;
  data: string = "";
  balance: string = "";
  value:any;
  account: any[] = [];

  /////////
  web3js:  any;
  provider: provider | undefined;
  ////////

  isExpanded:string = "false";

  stakeShow:boolean = false;
  unstakeShow:boolean = false;

  vGovStakeForm: FormGroup;
  vGovUnStakeForm: FormGroup;

  constructor(private web3: Web3Service, private formBuilder: FormBuilder) {
    this.vGovStakeForm = this.formBuilder.group({
      amount: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });

    this.vGovUnStakeForm = this.formBuilder.group({
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
      })
    })
  }

stakeToken(account:any){
  this.web3.connectWeb3().then((response:any)=>{
    this.web3js = response;

    const instance = new this.web3js.eth.Contract(vGovernanceContract, "0xc7f8894accd0c6Da9F30DeC316799C56B772C3Fd");
    const approveInstanceAddress = new this.web3js.eth.Contract(BUSDContract, "0x67a7A2363e5387E6989B9b3f338AB0E009f7C025");

    let convertToWei = this.web3js.utils.toWei(this.vGovStakeForm.value.amount, 'Ether');

    approveInstanceAddress.methods
    .approve("0x654ABd04dD9fDd30184E09F0c948Fc8A1f648540", convertToWei)
    .send({ from: account })
    .on('transactionHash', (hash:any) => {

    }).on('receipt', (receipt:any) => {
      instance.methods
      .deposit(0,convertToWei)
      .send({ from: account });
    });

  })
}

unstakeToken(account:any){
  this.web3.connectWeb3().then((response:any)=>{
    this.web3js = response;

    const instance = new this.web3js.eth.Contract(vGovernanceContract, "0xc7f8894accd0c6Da9F30DeC316799C56B772C3Fd");
    const approveInstanceAddress = new this.web3js.eth.Contract(BUSDContract, "0x67a7A2363e5387E6989B9b3f338AB0E009f7C025");

    let convertToWei = this.web3js.utils.toWei(this.vGovUnStakeForm.value.amount, 'Ether');

    approveInstanceAddress.methods
    .approve("0x654ABd04dD9fDd30184E09F0c948Fc8A1f648540", convertToWei)
    .send({ from: account })
    .on('transactionHash', (hash:any) => {

    }).on('receipt', (receipt:any) => {
      instance.methods
      .withdraw(0,convertToWei)
      .send({ from: account });
    });

  })
}

  showstake(){
      if(this.stakeShow == true){
        this.stakeShow = false;
      }else{
        this.stakeShow = true;
        this.unstakeShow = false;
      }
  }

  showunstake(){
    if(this.unstakeShow == true){
      this.unstakeShow = false;
    }else{
      this.unstakeShow = true;
      this.stakeShow = false;
    }
  }

}
