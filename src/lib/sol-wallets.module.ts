import { NgModule } from '@angular/core';
import { SolWalletsComponent } from './sol-wallets.component';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [
    SolWalletsComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    SolWalletsComponent
  ]
})
export class SolWalletsModule { }
