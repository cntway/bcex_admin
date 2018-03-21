
import { Component } from '@angular/core';
import { EditComponentBase } from '@sdk/sdk.component';
import * as skd_columns from '@sdk/sdk.columns';
import * as sdk_model from '@sdk/sdk.model';

@Component({
    selector: 'app-pair-add',
    templateUrl: './pair-add.component.html',
})
export class PairAddComponent extends EditComponentBase {

    columns = skd_columns.coin_pair_get_columns;
    edit_model = new sdk_model.CoinPairPost();
    save() {
        const param = Object.assign(this.edit_model, this.validateForm.getRawValue());
        this.sdk.coin_pair_post_api(param).subscribe((res) => {
            this.subject.next('onOk');
            this.close();
        });
    }

}
