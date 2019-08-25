import { Component, OnInit } from '@angular/core';
import { Wallet } from 'src/entities/wallet';
import { SpendingsService } from 'src/services/spendings.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogTransactionFormComponent } from '../dialog-transaction-form/dialog-transaction-form.component';

@Component({
  selector: 'app-wallet-details',
  templateUrl: './wallet-details.component.html',
  styleUrls: ['./wallet-details.component.scss']
})
export class WalletDetailsComponent implements OnInit {

  subscriptions : Array<Subscription> = [];
  selectedWallet : Wallet;
  deviceType = this.service.deviceType;
  
  constructor(
    private service : SpendingsService,
    private route : ActivatedRoute,
    private router : Router,
    private dialog : MatDialog
  ) { }

  ngOnInit() {
    if(this.deviceType != 'MOBILE'){
      this.subscriptions.push(this.route.paramMap.subscribe(paramMap => {
        let portalId = parseInt(paramMap.get('portalId'));
        let walletId = parseInt(paramMap.get('walletId'))
        this.router.navigate(['portals',portalId,'wallets',walletId]);
      }));
    }
    this.subscriptions.push(this.route.paramMap.subscribe(paramMap => {
      let portalId = parseInt(paramMap.get('portalId'));
      let walletId = parseInt(paramMap.get('walletId'))
      this.service.setSelectedPortal(portalId);
      this.service.setSelectedWallet(walletId);
    }));
    this.subscriptions.push(this.service.selectedWallet$.subscribe(selectedWallet => {
      this.selectedWallet = selectedWallet;
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    })
  }

  addTransaction(type : String){
    this.service.openNewTransactionDialog(type);
  }

}
