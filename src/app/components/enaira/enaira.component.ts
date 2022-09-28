import { Component, OnInit } from '@angular/core';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels  } from '@techiediaries/ngx-qrcode';

@Component({
  selector: 'app-enaira',
  templateUrl: './enaira.component.html',
  styleUrls: ['./enaira.component.css']
})
export class EnairaComponent implements OnInit {

  public elementType:any;
  public correctonLevel:any;
  public value:any;
  constructor() { }

  ngOnInit(): void {
    this.elementType = NgxQrcodeElementTypes.URL;
    this.correctonLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
    this.value = "engn://#01GDWVWXTE62EC5DG71RP7SZ96";

  }

}
