import { Component, OnInit } from '@angular/core';
import { Web3Service } from 'src/app/services/contract/web3.service';
import truncateEthAddress from 'truncate-eth-address'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  authenticated: boolean = false;
  data: string = "";
  balance: string = "";
  account: any[] = [];
  constructor(private web3: Web3Service) { }

  ngOnInit(): void {
    this.Connect();
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




}
