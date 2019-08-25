import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { AppComponent } from '../components/app/app.component';
import { MaterialModule } from './material.module';
import { IndexComponent } from 'src/components/index/index.component';
import { WalletDetailsComponent } from 'src/components/wallet-details/wallet-details.component';
import { WalletTransactionsComponent } from 'src/components/wallet-transactions/wallet-transactions.component';
import { WalletChartComponent } from 'src/components/wallet-chart/wallet-chart.component';
import { DialogTransactionFormComponent } from 'src/components/dialog-transaction-form/dialog-transaction-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogTransactionDeleteComponent } from 'src/components/dialog-transaction-delete/dialog-transaction-delete.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    WalletDetailsComponent,
    WalletTransactionsComponent,
    WalletChartComponent,
    DialogTransactionFormComponent,
    DialogTransactionDeleteComponent
  ],
  entryComponents:[
    DialogTransactionFormComponent,
    DialogTransactionDeleteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    DeviceDetectorModule.forRoot(),
    MaterialModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
