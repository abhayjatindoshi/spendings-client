import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpendingsService } from 'src/services/spendings.service';
import { Subscription } from 'rxjs';
import { Wallet } from 'src/entities/wallet';
import { Portal } from 'src/entities/portal';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  
  subscriptions : Array<Subscription> = [];
  deviceType = this.service.deviceType;
  selectedPortal : Portal;
  selectedWallet : Wallet;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: SpendingsService
  ) { 
    if(this.deviceType == 'MOBILE'){
      this.subscriptions.push(this.route.paramMap.subscribe(paramMap => {
        let portalId = parseInt(paramMap.get('portalId'));
        let walletId = parseInt(paramMap.get('walletId'))
        this.router.navigate(['portals',portalId,'wallets',walletId,'details']);
      }));
    }
    this.subscriptions.push(this.route.paramMap.subscribe(paramMap => {
      let portalId = parseInt(paramMap.get('portalId'));
      let walletId = parseInt(paramMap.get('walletId'))
      this.service.setSelectedPortal(portalId);
      this.service.setSelectedWallet(walletId);
    }));
    
    this.subscriptions.push(this.service.selectedPortal$.subscribe(selectedPortal => {
      this.selectedPortal = selectedPortal;
    }));
    
    this.subscriptions.push(this.service.selectedWallet$.subscribe(selectedWallet => {
      this.selectedWallet = selectedWallet;
    }));
  }

  ngOnInit() {
    
  }

  ngOnDestroy(){
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    })
  }

}
