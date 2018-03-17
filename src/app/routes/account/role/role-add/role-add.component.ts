
import { Component } from '@angular/core';
import { EditComponentBase } from '@sdk/sdk.component';
import * as users_enum from '@sdk/sdk.admins_enum';
import * as skd_columns from '@sdk/sdk.columns';
import * as sdk_model from '@sdk/sdk.model';
import { EnumUserTypeTranslate } from '@sdk/sdk.admins_enum';

@Component({
    selector: 'app-role-add',
    templateUrl: './role-add.component.html',
})
export class RoleAddComponent extends EditComponentBase {

    columns = skd_columns.sys_role_get_columns;
    edit_model = new sdk_model.SysRolePost();
    options = EnumUserTypeTranslate;
    save() {
        const param = Object.assign(this.edit_model, this.validateForm.getRawValue());
        this.sdk.sys_role_post_api(param).subscribe((res) => {
            this.subject.next('onOk');
            this.close();
        });
    }

}
