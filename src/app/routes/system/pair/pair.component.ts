
import { Observable } from 'rxjs/Rx';
import { Component } from '@angular/core';
import { ComponentBase } from '@sdk/sdk.component';
import { QueryParam } from '@sdk/sdk.util';
import * as sdk_model from '@sdk/sdk.model';
import * as skd_columns from '@sdk/sdk.columns';
import { PairAddComponent } from './pair-add/pair-add.component';
import { PairEditComponent } from './pair-edit/pair-edit.component';

@Component({
    selector: 'app-pair',
    templateUrl: './pair.component.html',
})
export class PairComponent extends ComponentBase {

    public deleteModel = undefined;
    public columns: Array<any> = skd_columns.coin_pair_get_columns;
    public editComponent = PairAddComponent;
    public addComponent = PairAddComponent;

    loadData(): Observable<any> {
        const parma_list = [];
        Object.keys(this.args).forEach((key) => {
            const qp = new QueryParam();
            qp.key = key;
            qp.value = this.args[key] + '%';
            qp.op = qp.op_like;
            parma_list.push(qp);
        });
        return this.sdk.coin_pair_get_api(parma_list, this.pi).map((res): any => {
            {
                return res;
            }
        });
    }

    deleteData(data: any) {

    }


}
