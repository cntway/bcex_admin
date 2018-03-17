import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { SdkService } from './sdk.service';


@NgModule({
    providers: [
        SdkService
    ]
})
export class SdkModule {
    constructor( @Optional() @SkipSelf() parentModule: SdkModule) {
        throwIfAlreadyLoaded(parentModule, 'SdkModule');
    }
}
