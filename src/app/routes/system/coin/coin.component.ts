
import { Observable } from 'rxjs/Rx';
import { Component } from '@angular/core';
import { ComponentBase } from '@sdk/sdk.component';
import { QueryParam } from '@sdk/sdk.util';
import * as sdk_model from '@sdk/sdk.model';
import * as skd_columns from '@sdk/sdk.columns';
import { CoinAddComponent } from './coin-add/coin-add.component';
import { CoinEditComponent } from './coin-edit/coin-edit.component';

@Component({
    selector: 'app-coin',
    templateUrl: './coin.component.html',
})
export class CoinComponent extends ComponentBase {

    public deleteModel = null;
    public columns: Array<any> = skd_columns.coin_info_get_columns;
    public editComponent = CoinEditComponent;
    public addComponent = CoinAddComponent;

    loadData(): Observable<any> {
        const parma_list = [];
        Object.keys(this.args).forEach((key) => {
            const qp = new QueryParam();
            qp.key = key;
            qp.value = this.args[key] + '%';
            qp.op = qp.op_like;
            parma_list.push(qp);
        });
        return this.sdk.coin_info_get_api(parma_list, this.pi).map((res): any => {
            {
                return res;
            }
        });
    }

    deleteData(data: any) {

    }


}
