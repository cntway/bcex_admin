import { Component } from '@angular/core';
import { EditComponentBase } from '@sdk/sdk.component';
import * as users_enum from '@sdk/sdk.admins_enum';
import * as skd_columns from '@sdk/sdk.columns';
import * as sdk_model from '@sdk/sdk.model';

@Component({
    selector: 'app-user-add',
    templateUrl: './user-add.component.html',
})
export class UserAddComponent extends EditComponentBase {

    columns = skd_columns.user_users_get_columns;
    edit_model = new sdk_model.UserUsersPost();
    options = users_enum.EnumIdTypeTranslate;
    save() {
        const param = Object.assign(this.edit_model, this.validateForm.getRawValue());
        this.sdk.user_users_post_api(param).subscribe((res) => {
            this.subject.next('onOk');
            this.close();
        });
    }

}
