import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from 'src/components/index/index.component';
import { WalletDetailsComponent } from 'src/components/wallet-details/wallet-details.component';
import { WalletTransactionsComponent } from 'src/components/wallet-transactions/wallet-transactions.component';
import { WalletChartComponent } from 'src/components/wallet-chart/wallet-chart.component';

const routes: Routes = [
  { path: 'portals/:portalId/wallets/:walletId', component: IndexComponent },
  { path: 'portals/:portalId/wallets/:walletId/details', component: WalletDetailsComponent },
  { path: 'portals/:portalId/wallets/:walletId/transactions', component: WalletTransactionsComponent },
  { path: 'portals/:portalId/wallets/:walletId/chart', component: WalletChartComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
