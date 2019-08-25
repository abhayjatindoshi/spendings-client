import { Injectable } from '@angular/core'
import { Portal } from '../entities/portal';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { SelectedSubject } from 'src/internals/subjects/SelectedSubject';
import { RequestSubject } from 'src/internals/subjects/RequestSubject';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Wallet } from '../entities/wallet';
import { Transaction } from '../entities/transaction';
import { ChartOptions } from '../entities/chart-options';
import { User } from '../entities/user';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DialogTransactionFormComponent } from 'src/components/dialog-transaction-form/dialog-transaction-form.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogTransactionDeleteComponent } from 'src/components/dialog-transaction-delete/dialog-transaction-delete.component';

@Injectable({
  providedIn: 'root'
})
export class SpendingsService {

  private API_URL_PREFEX: String = '/api/v1';
  private MONTHS_ARRAY: Array<String> = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  public deviceType : string;
  
  constructor(
    private http: HttpClient,
    private deviceDetector: DeviceDetectorService,
    private dialog: MatDialog
  ) { 
    if(this.deviceDetector.isDesktop()){
      this.deviceType = 'DESKTOP';
    } else if(this.deviceDetector.isTablet()){
      this.deviceType = 'TABLET';
    } else {
      this.deviceType = 'MOBILE';
    }
  }

  public me$ : Subject<User> = new RequestSubject<User>(() => {
    return this.http.get<User>(this.API_URL_PREFEX + '/me');
  })

  public selectedPortal$ : SelectedSubject<Portal> = new SelectedSubject<Portal>(null, ()=>{
    if(this.categories$) this.categories$.reload();
    if(this.wallets$) this.wallets$.reload();
    if(this.transactions$) this.transactions$.reload();
    if(this.chartData$) this.chartData$.reload();
  });
  public portals$ : RequestSubject<Array<Portal>> = new RequestSubject<Array<Portal>>(() => {
    return this.http.get<Array<Portal>>(this.API_URL_PREFEX + '/portals');
  });

  public categories$ : RequestSubject<Array<String>> = new RequestSubject<Array<String>>(() => {
    const subject = new Subject<Array<String>>();
    this.selectedPortal$.pipe(first()).subscribe(portal => {
      const httpOptions = {
        headers : new HttpHeaders({
          'X-EC-PORTAL': portal.id.toString()
        })
      }
      this.http.get<Array<String>>(this.API_URL_PREFEX + '/categories', httpOptions).subscribe(categories => {
        subject.next(categories);
      });
    })
    return subject;
  });

  public selectedWallet$ : SelectedSubject<Wallet> = new SelectedSubject<Wallet>(null,() => {
    if(this.transactions$) this.transactions$.reload();
    if(this.chartData$) this.chartData$.reload();
  });
  public wallets$ : RequestSubject<Array<Wallet>> = new RequestSubject<Array<Wallet>>(() => {
    const subject = new Subject<Array<Wallet>>();
    this.selectedPortal$.pipe(first()).subscribe(portal => {
      const httpOptions = {
        headers : new HttpHeaders({
          'X-EC-PORTAL': portal.id.toString()
        })
      }
      this.http.get<Array<Wallet>>(this.API_URL_PREFEX + '/wallets', httpOptions).subscribe(wallets => {
        subject.next(wallets);
      });
    })
    return subject;
  })

  public getSelectedWalletSubjectFor(id : number) : Subject<Wallet>{
    this.selectedPortal$.pipe(first()).subscribe(portal => {
      const httpOptions = {
        headers : new HttpHeaders({
          'X-EC-PORTAL': portal.id.toString()
        })
      }
      this.http.get<Wallet>(this.API_URL_PREFEX + '/wallets/' + id, httpOptions).subscribe(wallet => {
        this.selectedWallet$.next(wallet);
      })
    })
    return this.selectedWallet$;
  }

  public transactions$ : RequestSubject<Array<Transaction>> = new RequestSubject<Array<Transaction>>(() => {
    const subject = new Subject<Array<Transaction>>();
    this.selectedPortal$.pipe(first()).subscribe(portal => {
      this.selectedWallet$.pipe(first()).subscribe(wallet => {
        let httpOptions = {
          headers : new HttpHeaders({
            'X-EC-PORTAL': portal.id.toString()
          })
        }
        this.http.get<Array<Transaction>>(this.API_URL_PREFEX + '/wallets/' + wallet.id + '/transactions', httpOptions).subscribe(transactions => {
          subject.next(transactions);
        })
      })
    });
    return subject;
  });

  private now : Date = new Date();
  public chartOptions$ = new SelectedSubject<ChartOptions>(new ChartOptions({
    type: 'EXPENSE',
    month: this.MONTHS_ARRAY[this.now.getMonth()],
    year: this.now.getFullYear().toString()
  }), ()=>{
    if(this.chartData$) this.chartData$.reload();
  });
  public chartData$ : RequestSubject<Array<any>> = new RequestSubject<Array<any>>(() => {
    const subject : Subject<Array<any>> = new Subject<Array<any>>();
    this.selectedPortal$.pipe(first()).subscribe(portal => {
      this.selectedWallet$.pipe(first()).subscribe(wallet => {
        this.chartOptions$.pipe(first()).subscribe(chartOptions => {
          let httpOptions = {
            params : new HttpParams({
              fromObject : {
                type: chartOptions.type,
                month: chartOptions.month + '-' + chartOptions.year
              }
            }),
            headers : new HttpHeaders({
              'X-EC-PORTAL': portal.id.toString()
            })
          }
          this.http.get<Array<any>>(this.API_URL_PREFEX + '/charts/wallet/' + wallet.id + '/categoriesVsExpenses', httpOptions).subscribe(chartData => {
            subject.next(chartData);
          })
        })
      })
    })
    return subject;
  })

  public setSelectedPortal(id : number) : void{
    this.portals$.subscribe(portals => {
      portals.forEach(portal => {
        if(portal.id == id){
          this.selectedPortal$.next(portal);
        }
      })
    });
  }

  public setSelectedWallet(id : number) : void{
    this.wallets$.subscribe(wallets => {
      wallets.forEach(wallet => {
        if(wallet.id == id){
          this.selectedWallet$.next(wallet);
        }
      })
    });
  }

  public createTransaction(transaction : Transaction) : Subject<any>{
    let transactionSubject = new Subject<Transaction>();
    this.selectedPortal$.subscribe(portal => {
      this.selectedWallet$.subscribe(wallet => {
        let httpOptions = {
          headers : new HttpHeaders({
            'X-EC-PORTAL': portal.id.toString(),
            'Content-Type': 'application/json'
          })
        }
        this.http.post<Transaction>(this.API_URL_PREFEX + '/wallets/' + wallet.id + '/transactions', JSON.stringify(transaction), httpOptions).subscribe(transaction => {
          this.chartData$.reload();
          this.transactions$.reload();
          if(transaction.type == 'INCOME'){
            wallet.balance = +wallet.balance + +transaction.amount;
          } else {
            wallet.balance = +wallet.balance - +transaction.amount;
          }
          this.selectedWallet$.next(wallet);
          transactionSubject.next(transaction);
        })
      })
    })
    return transactionSubject;
  }

  public editTransaction(existingTransaction: Transaction, updatedTransaction: Transaction) : Subject<any>{
    let responseSubject = new Subject<any>();
    this.selectedPortal$.subscribe(portal => {
      this.selectedWallet$.subscribe(wallet => {
        let httpOptions = {
          headers : new HttpHeaders({
            'X-EC-PORTAL': portal.id.toString(),
            'Content-Type': 'application/json',
            'X-METHOD-OVERRIDE': 'PATCH'
          })
        }
        this.http.post<Transaction>(this.API_URL_PREFEX + '/wallets/' + wallet.id + '/transactions/' + existingTransaction.id, JSON.stringify(updatedTransaction), httpOptions).subscribe(response => {
          this.chartData$.reload();
          this.transactions$.reload();
          
          let updateValue = +updatedTransaction.amount - +existingTransaction.amount
          if(existingTransaction.type == 'INCOME'){
            wallet.balance = +wallet.balance + +updateValue;
          } else {
            wallet.balance = +wallet.balance - +updateValue;
          }
          this.selectedWallet$.next(wallet);
          
          responseSubject.next(response);
        })
      })
    })
    return responseSubject;
  }

  public deleteTransaction(transaction : Transaction) : Subject<any>{
    let responseSubject = new Subject<any>();
    this.selectedPortal$.subscribe(portal => {
      this.selectedWallet$.subscribe(wallet => {
        let httpOptions = {
          headers : new HttpHeaders({
            'X-EC-PORTAL': portal.id.toString(),
            'Content-Type': 'application/json',
            'X-METHOD-OVERRIDE': 'DELETE'
          })
        }
        this.http.post<Transaction>(this.API_URL_PREFEX + '/wallets/' + wallet.id + '/transactions/' + transaction.id, null, httpOptions).subscribe(response => {
          this.chartData$.reload();
          this.transactions$.reload();
          
          if(transaction.type == 'INCOME'){
            wallet.balance = +wallet.balance - +transaction.amount;
          } else {
            wallet.balance = +wallet.balance + +transaction.amount;
          }
          this.selectedWallet$.next(wallet);
          
          responseSubject.next(response);
        })
      })
    })
    return responseSubject;
  }

  public openNewTransactionDialog(transactionType: String){
    this.dialog.open(DialogTransactionFormComponent,{
      maxWidth: '100vw !important',
      position: {
        top: '75px'
      },
      width: this.deviceType == 'MOBILE' ? '100%' : '50%',
      data: {
        type : transactionType
      }
    });
  }

  public openEditTransactionDialog(transaction : Transaction){
    this.dialog.open(DialogTransactionFormComponent,{
      maxWidth: '100vw !important',
      position: {
        top: '75px'
      },
      width: this.deviceType == 'MOBILE' ? '100%' : '50%',
      data: {
        transaction : transaction
      }
    })
  }

  public openDeleteTransactinDialog(transaction: Transaction){
    this.dialog.open(DialogTransactionDeleteComponent,{
      maxWidth: '100vw !important',
      position: {
        top: '75px'
      },
      width: this.deviceType == 'MOBILE' ? '100%' : '50%',
      data:{
        transaction: transaction
      }
    }) 
  }
}
