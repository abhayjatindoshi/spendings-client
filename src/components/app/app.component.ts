import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Portal } from 'src/entities/portal';
import { Wallet } from 'src/entities/wallet';
import { SpendingsService } from 'src/services/spendings.service';
import { User } from 'src/entities/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Spendings';
  deviceType = this.service.deviceType;
  subscriptions : Array<Subscription> = [];
  currentUser : User;
  portals : Array<Portal>;
  selectedPortal : Portal;
  wallets : Array<Wallet>;
  selectedWallet : Wallet;
  

  constructor(
    private service : SpendingsService,
    private router : Router
  ){ 
    this.subscriptions.push(this.service.me$.subscribe(currentUser => {
      this.currentUser = currentUser;
    },() => {
      window.location.href = '/login';
    }))
    this.subscriptions.push(this.service.portals$.subscribe(portals => {
      this.portals = portals;
      if(this.router.url == '/' && portals.length > 0){
        this.service.selectedPortal$.next(portals[0]);
      }
    }));
    this.subscriptions.push(this.service.selectedPortal$.subscribe(selectedPortal => {
      this.selectedPortal = selectedPortal;
    }));
    this.subscriptions.push(this.service.wallets$.subscribe(wallets => {
      this.wallets = wallets;
      if(this.router.url == '/' && wallets.length > 0){
        this.service.selectedWallet$.next(wallets[0]);
        this.router.navigate(['portals',this.selectedPortal.id,'wallets',wallets[0].id]);
      }
    }));
    this.subscriptions.push(this.service.selectedWallet$.subscribe(selectedWallet => {
      this.selectedWallet = selectedWallet;
    }));
  }

  ngOnInit(){
    
  }

  ngOnDestroy(){
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
