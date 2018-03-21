import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MarketComponent } from './market/market.component';
import { MarketEditComponent } from './market/market-edit/market-edit.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'market', component: MarketComponent },

];

const COMPONENT_NOROUNT = [MarketEditComponent];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ...COMPONENT_NOROUNT,
    MarketComponent,
    MarketEditComponent
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class SystemModule { }
