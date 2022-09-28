import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnairaService {
  baseApi = "https://sandbox.payarena.com/";
  constructor(private http:HttpClient) { }

  ListInvoices(){
    return this.http.get( this.baseApi + "​/api​/ENairaEcommerceApi​/ListInvoices" )
  }

  CreateInvoice(invoice:any){
    return this.http.post( this.baseApi + "​​/api​/ENairaEcommerceApi​/CreateInvoice", invoice)
  }

  GetInvoiceByGuid​(Guid:any){
    return this.http.get( this.baseApi + "​/api​/ENairaEcommerceApi​/GetInvoiceByGuid​/" + Guid )
  }

  GetInvoiceByPaymentId​(paymentId:any){
    return this.http.get( this.baseApi + "​/api​/ENairaEcommerceApi​/GetInvoiceByPaymentId​/" + paymentId )
  }

  Payment3DSecure(){
    return this.http.get( this.baseApi + "​​/api​/ENairaEcommerceApi​/Payment3DSecure" )
  }
}
