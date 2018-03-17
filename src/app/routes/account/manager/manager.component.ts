import { Component, OnInit } from '@angular/core';
import { AccountBase } from '../account.base';
import { QueryParam } from '@sdk/sdk.util';
import * as model_sdk from '@sdk/sdk.model';
import * as skd_columns from '@sdk/sdk.columns';
import { ManagerEditComponent } from './manager-edit/manager-edit.component';


@Component({
    selector: 'app-manager',
    templateUrl: './manager.component.html',
})
export class ManagerComponent extends AccountBase implements OnInit {


    ngOnInit() {
    }

    public columns: Array<any> = skd_columns.muser_users_get_columns;

    load(pi?: number) {
        if (typeof pi !== 'undefined') {
            this.pi = pi || 1;
        }
        const ob = this.loadData(pi);
        ob.subscribe(data => {
            this.list = data.results;
        });
    }

    loadData(pi?: number) {
        const parma_list = [];
        Object.keys(this.args).forEach((key) => {
            const qp = new QueryParam();
            qp.key = key;
            qp.value = this.args[key] + '%';
            qp.op = qp.op_like;
            parma_list.push(qp);
        });
        return this.sdk.muser_users_get_api(parma_list, pi);
    }

    deleteData(data: any) {
        const modeDelete = new model_sdk.SysRoleDelete();
        modeDelete.roleid = data['roleid'];
        return this.sdk.sys_role_delete_api(modeDelete);
    }

    edit(i) {
        const me = this;
        me.modalHelper.static(ManagerEditComponent, { i }, 600).subscribe((saveOk) => {
            // 操作成功回调
            if (saveOk) {
                me.load();
                // me.message.info('操作成功');
            }
        });
    }
}
