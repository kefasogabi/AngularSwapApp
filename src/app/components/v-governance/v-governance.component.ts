import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Web3Service } from 'src/app/services/contract/web3.service';
import truncateEthAddress from 'truncate-eth-address'
import Web3 from 'web3';
import { provider } from 'web3-core';
import vFarmContract from "../../../assets/contracts/vFarmAbi.json";
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



  })
}

unstakeToken(account:any){
  this.web3.connectWeb3().then((response:any)=>{
    this.web3js = response;



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
