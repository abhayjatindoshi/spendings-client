import { Component, OnInit, Inject } from '@angular/core';
import { SpendingsService } from 'src/services/spendings.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Chart } from 'chart.js';
import { ChartOptions } from 'src/entities/chart-options';

@Component({
  selector: 'app-wallet-chart',
  templateUrl: './wallet-chart.component.html',
  styleUrls: ['./wallet-chart.component.scss']
})
export class WalletChartComponent implements OnInit {

  subscriptions : Array<Subscription> = [];
  deviceType = this.service.deviceType;
  colorCodes : Array<String> = ["#f44336","#8bc34a","#03a9f4","#ffeb3b","#e91e63","#673ab7","#ff5722","#9c27b0","#4caf50","#795548","#3f51b5","#cddc39","#ffc107","#2196f3","#ff9800","#00bcd4","#009688"];
  chartData : Array<any>;
  selectedChartOptions : ChartOptions;

  constructor(
    private service : SpendingsService,
    private route : ActivatedRoute,
    private router : Router,
    @Inject(DOCUMENT) private document,
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
    this.subscriptions.push(this.service.chartOptions$.subscribe(chartOptions => {
      this.selectedChartOptions = new ChartOptions(chartOptions);
    }))
    this.subscriptions.push(this.service.chartData$.subscribe(chartData => {
      this.chartData = chartData;
      
      let labels = [];
      let data = [];
      let colors = [];
      
      chartData.forEach((item, i) => {
        labels.push(item.category);
        data.push(item.total_amount);
        if(i < this.colorCodes.length){
          colors.push(this.colorCodes[i]);
        } else {
          colors.push('#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6));
        }
      });

      let chartOptions = {
        type:'pie',
        data: {
          labels: labels,
          datasets: [{
            label: 'Expenses',
            borderColor: '#00000000',
            backgroundColor: colors,
            data: data
          }]
        },
        options: {
          animation: {
            animateScale: true
          },
          legend :{
            display: true,
            position: this.deviceType == 'MOBILE' ? 'bottom' : 'right',
            labels: {
              boxWidth: 20
            }
          }
        }
      };

      let chartWrapper = this.document.getElementById('expenses-pie-chart-wrapper');
      while(chartWrapper.firstChild){
        chartWrapper.removeChild(chartWrapper.firstChild);
      }
      
      let canvas = this.document.createElement('canvas');
      if(this.deviceType == 'MOBILE'){
        canvas.setAttribute('width','100%');
        canvas.setAttribute('height','auto');
      }
      chartWrapper.appendChild(canvas);

      new Chart(canvas,chartOptions);
    }));
  }

  updateChart(){
    this.service.chartOptions$.next(this.selectedChartOptions);
  }

}
