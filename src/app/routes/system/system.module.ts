import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MarketComponent } from './market/market.component';
import { MarketEditComponent } from './market/market-edit/market-edit.component';
import { Routes, RouterModule } from '@angular/router';
import { CoinComponent } from './coin/coin.component';
import { CoinAddComponent } from './coin/coin-add/coin-add.component';
import { CoinEditComponent } from './coin/coin-edit/coin-edit.component';
import { PairComponent } from './pair/pair.component';
import { PairAddComponent } from './pair/pair-add/pair-add.component';
import { PairEditComponent } from './pair/pair-edit/pair-edit.component';

const routes: Routes = [
  { path: 'market', component: MarketComponent },
  { path: 'coin', component: CoinComponent },
  { path: 'pair', component: PairComponent },

];

const COMPONENT_NOROUNT = [
  MarketEditComponent,
  CoinAddComponent,
  CoinEditComponent,
  PairEditComponent,
  PairAddComponent,
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ...COMPONENT_NOROUNT,
    MarketComponent,
    MarketEditComponent,
    CoinComponent,
    CoinAddComponent,
    CoinEditComponent,
    PairComponent,
    PairAddComponent,
    PairEditComponent
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class SystemModule { }
