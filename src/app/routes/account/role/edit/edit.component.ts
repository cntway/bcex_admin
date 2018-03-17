import { NzModalSubject } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SdkService } from '@sdk/sdk.service';
import { _HttpClient } from '@delon/theme';
import * as model_sdk from '@sdk/sdk.model';
import { EnumUserTypeTranslate } from '@sdk/sdk.admins_enum';

@Component({
    selector: 'app-role-edit',
    templateUrl: './edit.component.html'
})
export class RoleEditComponent implements OnInit {
    i: any;
    is_new: boolean;
    title: string;
    options = EnumUserTypeTranslate;
    constructor(
        private sdk: SdkService,
        private subject: NzModalSubject,
        public http: _HttpClient) { }

    ngOnInit() {

        if (Object.keys(this.i).length === 0) {
            this.is_new = true;
            this.title = '添加';
        } else {
            this.is_new = false;
            this.title = '修改';
        }
    }

    save(e) {
        if (this.is_new) {
            this.add();
        } else {
            this.update();
        }
    }

    update() {
        const param = Object.assign(new model_sdk.SysRolePut(), this.i);
        this.sdk.sys_role_put_api(param).subscribe((res) => {
            this.subject.next('onOk');
            this.close();
        });
    }

    add() {
        console.log(typeof (this.i.roletype));
        console.log(this.i.roletype);

        const param = Object.assign(new model_sdk.SysRolePost(), this.i);
        this.sdk.sys_role_post_api(param).subscribe((res) => {
            this.subject.next('onOk');
            this.close();
        });
    }

    close() {
        this.subject.destroy();
    }
}
