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
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { VStakeComponent } from './components/v-stake/v-stake.component';
import { VFarmComponent } from './components/v-farm/v-farm.component';
import { VSaveComponent } from './components/v-save/v-save.component';
import { QRCodeModule } from 'angularx-qrcode';
import { VGovernanceComponent } from './components/v-governance/v-governance.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    VSwapComponent,
    VPegSwapComponent,
    EnairaComponent,
    VStakeComponent,
    VFarmComponent,
    VSaveComponent,
    VGovernanceComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxQRCodeModule,
    QRCodeModule,
    RouterModule.forRoot([
      { path: '', component: VSwapComponent },
      { path: 'vswap', component: VSwapComponent },
      { path: 'vpegswap', component: VPegSwapComponent },
      { path: 'vstake', component: VStakeComponent },
      { path: 'vFarm', component: VFarmComponent },
      { path: 'vSave', component: VSaveComponent },
      { path: 'vGovernance', component: VGovernanceComponent }
    ])
  ],
  providers: [
    EnairaService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
