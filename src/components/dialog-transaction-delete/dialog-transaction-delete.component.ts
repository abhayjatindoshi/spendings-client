import { Component, OnInit, Inject } from '@angular/core';
import { SpendingsService } from '../../services/spendings.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Transaction } from 'src/entities/transaction';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dialog-transaction-delete',
  templateUrl: './dialog-transaction-delete.component.html',
  styleUrls: ['./dialog-transaction-delete.component.scss']
})
export class DialogTransactionDeleteComponent implements OnInit {

  subscriptions : Array<Subscription> = [];
  transaction : Transaction;

  constructor(
    private service: SpendingsService,
    private dialog : MatDialogRef<DialogTransactionDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) { 
    this.transaction = data.transaction;
  }

  ngOnInit() {
  }

  deleteTransaction(){
    this.subscriptions.push(this.service.deleteTransaction(this.transaction).subscribe(response => {
      this.dialog.close();
    }));
  }

  ngOnDestroy(){
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

}
