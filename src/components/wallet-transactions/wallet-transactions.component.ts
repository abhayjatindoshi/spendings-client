import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpendingsService } from 'src/services/spendings.service';
import { Transaction } from 'src/entities/transaction';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-wallet-transactions',
  templateUrl: './wallet-transactions.component.html',
  styleUrls: ['./wallet-transactions.component.scss']
})
export class WalletTransactionsComponent implements OnInit {

  subscriptions : Array<Subscription> = [];
  deviceType = this.service.deviceType;
  transactions : Array<Transaction>;
  focusedTransaction : Transaction;

  constructor(
    public service : SpendingsService,
    private route : ActivatedRoute,
    private router : Router
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
    this.subscriptions.push(this.service.transactions$.subscribe(transactions => {
      this.transactions = transactions;
    }));
  }

  focusTransaction(transaction: Transaction){
    if(this.focusedTransaction == transaction){
      this.focusedTransaction = null;
    } else {
      this.focusedTransaction = transaction;
    }
  }

  ngOnDestroy(){
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    })
  }

}
