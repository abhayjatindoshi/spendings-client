import { Component, OnInit, Inject } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { SpendingsService } from 'src/services/spendings.service';
import { Transaction } from 'src/entities/transaction';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-transaction-form',
  templateUrl: './dialog-transaction-form.component.html',
  styleUrls: ['./dialog-transaction-form.component.scss']
})
export class DialogTransactionFormComponent implements OnInit {

  subscriptions : Array<Subscription> = [];
  deviceType = this.service.deviceType;
  categories : Array<String>;
  filteredCategories : Observable<Array<String>>;
  transaction : Transaction;
  transactionForm : FormGroup;

  get form(){
    return this.transactionForm.controls;
  }

  constructor(
    private service: SpendingsService,
    @Inject(MAT_DIALOG_DATA) private data : any,
    private dialog : MatDialogRef<DialogTransactionFormComponent>,
  ) { }

  ngOnInit() {
    this.transaction = this.data.transaction;

    if(this.transaction){
      this.transactionForm = new FormGroup({
        type: new FormControl({
          value: this.transaction.type,
          disabled: true
        }),
        amount: new FormControl(this.transaction.amount,[
          Validators.required,
          Validators.min(1)
        ]),
        category: new FormControl(this.transaction.category,[
          Validators.required
        ]),
        description: new FormControl(this.transaction.description)
      })
    } else {
      this.transactionForm = new FormGroup({
        type: new FormControl(this.data.type),
        amount: new FormControl('',[
          Validators.required,
          Validators.min(1)
        ]),
        category : new FormControl('',[
          Validators.required
        ]),
        description : new FormControl
      })
    }

    this.subscriptions.push(this.service.categories$.subscribe(categories => {
      this.categories = categories;
      this.filteredCategories = this.transactionForm.controls.category.valueChanges.pipe(
        startWith(''),
        map(value => {
          let filterValue = value.toUpperCase();
            let filteredList = this.categories.filter(category => category.startsWith(filterValue));
            if(filteredList.length == 0){
              filteredList.push(filterValue.split(/[^A-Z0-9]+/).join('_'));
            }
            return filteredList;
        })
      );
    }))
  }

  formSubmit(){
    if(this.transactionForm.status == 'VALID'){
      let category = this.transactionForm.value.category;
      this.transactionForm.controls.category.setValue(category.toUpperCase().split(/[^A-Z0-9]+/).join('_'));
      
      if(this.transaction){
        let updatedTransaction = new Transaction(this.transactionForm.value);
        this.subscriptions.push(this.service.editTransaction(this.transaction, updatedTransaction).subscribe(response => {
          this.dialog.close();
        }))
      } else {
        let transaction = new Transaction(this.transactionForm.value);
        this.subscriptions.push(this.service.createTransaction(transaction).subscribe(() => {
          this.dialog.close();
        }));
      }
    }
  }

  ngOnDestroy(){
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

}
