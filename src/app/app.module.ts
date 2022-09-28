import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { VSwapComponent } from './components/v-swap/v-swap.component';
import { VPegSwapComponent } from './components/v-peg-swap/v-peg-swap.component';
import { EnairaComponent } from './components/enaira/enaira.component';
import { EnairaService } from './services/enaira.service';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode'

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    VSwapComponent,
    VPegSwapComponent,
    EnairaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxQRCodeModule,
    RouterModule.forRoot([
      { path: '', component: VSwapComponent },
      { path: 'vswap', component: VSwapComponent },
      { path: 'vpegswap', component: VPegSwapComponent },
    ])
  ],
  providers: [
    EnairaService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
