import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ZselectComponent } from './zselect.component';


const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
      ...COMPONENT_NOROUNT,
      ZselectComponent
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class ZselectModule { }
