
import { Component } from '@angular/core';
import { EditComponentBase } from '@sdk/sdk.component';
import * as users_enum from '@sdk/sdk.admins_enum';
import * as skd_columns from '@sdk/sdk.columns';
import * as sdk_model from '@sdk/sdk.model';

@Component({
    selector: 'app-role-right',
    templateUrl: './role-right.component.html',
})
export class RoleRightComponent extends EditComponentBase {

    columns = skd_columns.sys_role_get_columns;
    edit_model = new sdk_model.SysRoleMenuPut();
    save() {
        const param = Object.assign(this.edit_model, this.validateForm.getRawValue());
        this.sdk.sys_role_menu_put_api(param).subscribe((res) => {
            this.subject.next('onOk');
            this.close();
        });
    }

}
