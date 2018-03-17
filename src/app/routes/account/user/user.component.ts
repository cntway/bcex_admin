import { Observable } from 'rxjs/Rx';
import { Component } from '@angular/core';
import { ComponentBase } from '@sdk/sdk.component';
import { QueryParam } from '@sdk/sdk.util';
import * as sdk_model from '@sdk/sdk.model';
import * as skd_columns from '@sdk/sdk.columns';
import { UserAddComponent } from './user-add/user-add.component';
import { UserEidtComponent } from './user-eidt/user-eidt.component';


@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
})
export class UserComponent extends ComponentBase {

    public deleteModel = null;
    public columns: Array<any> = skd_columns.user_users_get_columns;
    public editComponent = UserEidtComponent;
    public addComponent = UserAddComponent;

    loadData(): Observable<any> {
        console.log(this.pi);
        const parma_list = [];
        Object.keys(this.args).forEach((key) => {
            const qp = new QueryParam();
            qp.key = key;
            qp.value = this.args[key] + '%';
            qp.op = qp.op_like;
            parma_list.push(qp);
        });
        return this.sdk.user_users_get_api(parma_list, this.pi).map((res): any => {
            {
                for (const row of res['results']) {
                    row['jsoncache'] = JSON.stringify(row['jsoncache']);
                }
                return res;
            }
        });
    }

    deleteData(i: any) {

    }


}
