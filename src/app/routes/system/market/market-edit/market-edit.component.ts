
import { Component } from '@angular/core';
import { EditComponentBase } from '@sdk/sdk.component';
import * as skd_columns from '@sdk/sdk.columns';
import * as sdk_model from '@sdk/sdk.model';

@Component({
    selector: 'app-market-edit',
    templateUrl: './market-edit.component.html',
})
export class MarketEditComponent extends EditComponentBase {

    columns = skd_columns.bcex_market_get_columns;
    edit_model = new sdk_model.BcexMarketPut();
    save() {
        const param = Object.assign(this.edit_model, this.validateForm.getRawValue());
        this.sdk.bcex_market_put_api(param).subscribe((res) => {
            this.subject.next('onOk');
            this.close();
        });
    }

}
