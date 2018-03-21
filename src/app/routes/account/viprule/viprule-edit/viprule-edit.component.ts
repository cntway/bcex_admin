
import { Component } from '@angular/core';
import { EditComponentBase } from '@sdk/sdk.component';
import * as skd_columns from '@sdk/sdk.columns';
import * as sdk_model from '@sdk/sdk.model';

@Component({
    selector: 'app-viprule-edit',
    templateUrl: './viprule-edit.component.html',
})
export class VipruleEditComponent extends EditComponentBase {

    columns = skd_columns.bonus_vip_rule_get_columns;
    edit_model = new sdk_model.BonusVipRulePut();
    save() {
        const param = Object.assign(this.edit_model, this.validateForm.getRawValue());
        this.sdk.bonus_vip_rule_put_api(param).subscribe((res) => {
            this.subject.next('onOk');
            this.close();
        });
    }

}
