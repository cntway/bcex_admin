
import { Observable } from 'rxjs/Rx';
import { Component } from '@angular/core';
import { ComponentBase } from '@sdk/sdk.component';
import { QueryParam } from '@sdk/sdk.util';
import * as sdk_model from '@sdk/sdk.model';
import * as skd_columns from '@sdk/sdk.columns';
import { MarketEditComponent } from './market-edit/market-edit.component';

@Component({
    selector: 'app-market',
    templateUrl: './market.component.html',
})
export class MarketComponent extends ComponentBase {
    public deleteModel = null;
    public columns: Array<any> = skd_columns.bcex_market_get_columns;
    public editComponent = MarketEditComponent;
    public addComponent = MarketEditComponent;

    loadData(): Observable<any> {
        const parma_list = [];
        Object.keys(this.args).forEach((key) => {
            const qp = new QueryParam();
            qp.key = key;
            qp.value = this.args[key] + '%';
            qp.op = qp.op_like;
            parma_list.push(qp);
        });
        return this.sdk.bcex_market_get_api(parma_list, this.pi).map((res): any => {
            {
                return res;
            }
        });
    }

    deleteData(data: any) {
        const param = Object.assign(new this.deleteModel(), data);
        return this.sdk.bcex_market_get_api(param);
    }


}
