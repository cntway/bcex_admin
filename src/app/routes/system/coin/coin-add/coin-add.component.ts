
import { Component } from '@angular/core';
import { EditComponentBase } from '@sdk/sdk.component';
import * as skd_columns from '@sdk/sdk.columns';
import * as sdk_model from '@sdk/sdk.model';

@Component({
    selector: 'app-coin-add',
    templateUrl: './coin-add.component.html',
})
export class CoinAddComponent extends EditComponentBase {

    columns = skd_columns.coin_info_get_columns;
    edit_model = new sdk_model.CoinInfoPost();
    save() {
        const param = Object.assign(this.edit_model, this.validateForm.getRawValue());
        this.sdk.coin_info_post_api(param).subscribe((res) => {
            this.subject.next('onOk');
            this.close();
        });
    }

}
