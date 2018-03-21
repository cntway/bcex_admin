import { Component, OnInit, OnDestroy, Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { NzMessageService } from 'ng-zorro-antd';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { SdkService } from '@sdk/sdk.service';
import { NzModalSubject } from 'ng-zorro-antd';
import * as model_sdk from '@sdk/sdk.model';
import * as users_enums from '@sdk/sdk.users_enum';
import * as bcexs_enums from '@sdk/sdk.bcexs_enum';
import * as admins_enums from '@sdk/sdk.admins_enum';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms'


@Injectable()
export abstract class ComponentBase implements OnInit, OnDestroy {

    pi = 1;
    ps = 10;
    list: Array<any> = [];
    args: any = {};
    isInitLoad: boolean = false;
    sub: Subscription;
    _loading: boolean;

    public abstract columns: Array<any>;
    public abstract deleteModel: any;
    public abstract editComponent: any;
    public abstract addComponent: any;
    public abstract loadData(): Observable<any>;
    public abstract deleteData(i: any);

    constructor(
        protected sdk: SdkService,
        protected message: NzMessageService,
        protected modalHelper: ModalHelper) {
    }

    ngOnInit() {
        if (this.isInitLoad) {
            this.load();
        }
    }

    ngOnDestroy() {
        try {
            if (this.sub) {
                this.sub.unsubscribe();
            }
        } catch (e) {
            console.error(e);
        }
    }

    /** 是否正在加载中 */
    get loading(): boolean {
        return this.sdk.loading;
    }

    load(pi?: number) {
        if (typeof pi !== 'undefined') {
            this.pi = pi || 1;
        }
        this.sub = this.loadData()
            .subscribe(data => {
                if (!data) {
                    return;
                }
                this.list = data.results;
            });
    }

    edit(i) {
        const me = this;
        let component: Component = null;
        if (Object.keys(i).length === 0) {
            component = this.addComponent;
        } else {
            component = this.editComponent;
        }
        me.modalHelper.static(component, { i }, 600).subscribe((saveOk) => {
            // 操作成功回调
            if (saveOk) {
                me.load();
            }
        });
    }


    clear() {
        this.args = {};
    }

    showMsg(msg: string) {
        this.message.info(msg);
    }

    delete(i) {
        this.deleteData(i)
            .subscribe(data => {
                this.showMsg('删除成功');
                this.load(this.pi);
            });
    }

}


@Injectable()
export abstract class EditComponentBase implements OnInit {

    title;
    i: any;
    _isNew: boolean;
    validateForm: FormGroup;
    admins_enums=admins_enums;
    users_enums=users_enums;
    bcexs_enums=bcexs_enums

    abstract columns: any;
    abstract edit_model: any;
    abstract save(i: any): void;

    constructor(
        protected http: _HttpClient,
        protected fb: FormBuilder,
        protected sdk: SdkService,
        protected subject: NzModalSubject) { }

    ngOnInit() {
        console.log(this.edit_model);

        this.isNew();
        const fields_options = this.edit_model.fields_options;
        console.log(fields_options);
        const group = {}
        for (const index in fields_options) {
            const validator = this.getValidator(index, fields_options[index]);
            group[index] = validator;
            if (index === 'userpwd') {
                group['checkPassword'] = [null, [Validators.required, this.confirmationValidator]];
            }
        }
        this.validateForm = this.fb.group(group);

        //模版生成代码，可以抽象为工具
        let tpl = '';
        for (const index in fields_options) {
            const type = fields_options[index]['type'];
            if (this.isEmail(type, index)) {
                tpl += this.getEmail(index, this.getFieldName(index));
            }
            if (this.isString(type, index)) {
                tpl += this.getString(index, this.getFieldName(index));
            }
            if (this.isPwd(type, index)) {
                tpl += this.getPWd(index, this.getFieldName(index));
            }
            if (this.isNumber(type, index)) {
                tpl += this.getNumber(index, this.getFieldName(index));
            }
            if (this.isEnum(type, index)) {
                tpl += this.getEnum(index, this.getFieldName(index));
            }
            if (this.isDate(type, index)) {
                tpl += this.getDate(index, this.getFieldName(index));
            }
            if (this.isDateTime(type, index)) {
                tpl += this.getDateTime(index, this.getFieldName(index));
            }
        }
        console.log(tpl);

    }

    isNew() {

        if (Object.keys(this.i).length === 0) {
            this._isNew = true;
            this.title = '添加';

        } else {
            this._isNew = false;
            this.title = '修改';
            setTimeout(_ => {
                for (const f in this.validateForm.controls) {
                    if (!this.validateForm.controls[f].valid) {
                        this.validateForm.controls[f].markAsDirty();
                    }
                    this.validateForm.controls[f].updateValueAndValidity();
                }
            });
        }
    }

    getValidator(index, option) {
        const type = option['type'];
        const val = this._isNew ? null : this.i[index];
        if (this.isEmail(type, index)) {
            return [val, [Validators.email]];
        }
        if (this.isPwd(type, index)) {
            return [val, [Validators.required]];
        }
        if (this.isString(type, index)) {
            return [val, [Validators.required]];
        }
        //TODO
        return [val, [Validators.required]];

    }

    close() {
        this.subject.destroy();
    }

    getFieldName(key: string): string {
        for (let c of this.columns) {
            if (c.index === key) {
                return c.text;
            }
        }
        return key;
    }

    updateConfirmValidator() {
        /** wait for refresh value */
        setTimeout(_ => {
            this.validateForm.controls['checkPassword'].updateValueAndValidity();
        });
    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.validateForm.controls['userpwd'].value) {
            return { confirm: true, error: true };
        }
    };

    getFormControl(name) {
        return this.validateForm.controls[name];
    }


    isEmail(key: string, filedName: string): boolean {
        return filedName.indexOf('email') > -1
    }

    isPwd(key: string, filedName: string): boolean {
        return filedName === 'userpwd'
    }

    isString(key: string, filedName: string): boolean {
        if (filedName === 'userpwd') {
            return false;
        }
        if (filedName.indexOf('email') > -1) {
            return false
        }
        return model_sdk.STRING_LIST.indexOf(key) > -1 || model_sdk.BYTE_LIST.indexOf(key) > -1;
    }

    isDate(key: string, filedName: string): boolean {
        return key === 'date';
    }
    isDateTime(key: string, filedName: string): boolean {
        return key === 'datetime';
    }
    isNumber(key: string, filedName: string): boolean {
        return model_sdk.FLOAT_LIST.indexOf(key) > -1 || key === 'int32' || key === 'int64' || model_sdk.UINT_LIAT.indexOf(key) > -1;
    }
    isEnum(key: string, filedName: string): boolean {
        return key.length > 4 && key.slice(0, 4) === 'Enum';
    }


    getEmail(key, label) {
        let tpl = `
                <div nz-form-item nz-row>
                    <div nz-form-label nz-col [nzSm]="6" [nzXs]="24">
                        <label for="${key}" nz-form-item-required>{{'${label}'|translate}}</label>
                    </div>
                    <div nz-form-control nz-col [nzSm]="14" [nzXs]="24" nzHasFeedback>
                        <nz-input [nzSize]="'large'" formControlName="${key}" ></nz-input>
                        <div nz-form-explain *ngIf="getFormControl('${key}').dirty&&getFormControl('${key}').hasError('${key}')">{{'The input is not valid E-mail!'|translate}}</div>
                    </div>
                </div>
            `
        return tpl;
    }


    getPWd(key, label) {
        let tpl = `
            <div nz-form-item nz-row>
                <div nz-form-label nz-col [nzSm]="6" [nzXs]="24">
                    <label for="${key}" nz-form-item-required>{{'${label}'|translate}}</label>
                </div>
                <div nz-form-control nz-col [nzSm]="14" [nzXs]="24" nzHasFeedback>
                    <nz-input [nzSize]="'large'" formControlName="${key}" [nzType]="'password'"  (ngModelChange)="updateConfirmValidator()"></nz-input>
                    <div nz-form-explain *ngIf="getFormControl('${key}').dirty&&getFormControl('${key}').hasError('required')">{{'Please input password!'|translate}}</div>
                </div>
             </div>
             <div nz-form-item nz-row>
                <div nz-form-label nz-col [nzSm]="6" [nzXs]="24">
                    <label for="checkPassword" nz-form-item-required>{{'确认密码'|translate}}</label>
                </div>
                <div nz-form-control nz-col [nzSm]="14" [nzXs]="24" nzHasFeedback>
                    <nz-input [nzSize]="'large'" formControlName="checkPassword" [nzType]="'password'" [nzId]="'checkPassword'"></nz-input>
                    <div nz-form-explain *ngIf="getFormControl('checkPassword').dirty&&getFormControl('checkPassword').hasError('required')">{{'Please confirm password!'|translate}}</div>
                    <div nz-form-explain *ngIf="getFormControl('checkPassword').dirty&&getFormControl('checkPassword').hasError('confirm')">{{'Two passwords that enter is inconsistent!'|translate}}</div>
                </div>
             </div>
            `
        return tpl;
    }

    getString(key, label) {
        let tpl = `
            <div nz-form-item nz-row>
            <div nz-form-label nz-col [nzSm]="6" [nzXs]="24">
                <label for="${key}" nz-form-item-required>
                    <span>
                        ${label}
                    </span>
                </label>
            </div>
            <div nz-form-control nz-col [nzSm]="14" [nzXs]="24" nzHasFeedback>
                <nz-input [nzSize]="'large'" formControlName="${key}" ></nz-input>
                <div nz-form-explain *ngIf="getFormControl('${key}').dirty&&getFormControl('${key}').hasError('required')">{{'Please input ${key}!'|translate}}</div>
            </div>
            </div>
            `
        return tpl;
    }

    getNumber(key, label) {
        let tpl = `
            <div nz-form-item nz-row>
            <div nz-form-label nz-col [nzSm]="6" [nzXs]="24">
                <label for="${key}" nz-form-item-required>
                    <span>
                        ${label}
                    </span>
                </label>
            </div>
            <div nz-form-control nz-col [nzSm]="14" [nzXs]="24" nzHasFeedback>
                <nz-input-number [nzSize]="'large'" formControlName="${key}"  [nzStep]="1" [nzMax]="1000000" [nzMin]="0"></nz-input-number>
                <div nz-form-explain *ngIf="getFormControl('${key}').dirty&&getFormControl('${key}').hasError('required')">{{'Please input ${key}!'|translate}}</div>
            </div>
            </div>
            `
        return tpl;
    }

    getEnum(key, label) {
        let tpl = `
            <div nz-form-item nz-row>
            <div nz-form-label nz-col [nzSm]="6" [nzXs]="24">
                <label for="${key}" nz-form-item-required>
                    <span>
                        ${label}
                    </span>
                </label>
            </div>
            <div nz-form-control nz-col [nzSm]="14" [nzXs]="24" nzHasFeedback>
                <app-zselect  [data]="options" formControlName="${key}" ></app-zselect>
                <div nz-form-explain *ngIf="getFormControl('${key}').dirty&&getFormControl('${key}').hasError('required')">{{'Please input ${key}!'|translate}}</div>
            </div>
            </div>
            `
        return tpl;
    }

    getDate(key, label) {
        let tpl = `
            <div nz-form-item nz-row>
            <div nz-form-label nz-col [nzSm]="6" [nzXs]="24">
                <label for="${key}" nz-form-item-required>
                    <span>
                        ${label}
                    </span>
                </label>
            </div>
            <div nz-form-control nz-col [nzSm]="14" [nzXs]="24" nzHasFeedback>
                <nz-datepicker [nzSize]="'large'" formControlName="${key}" ></nz-datepicker>
                <div nz-form-explain *ngIf="getFormControl('${key}').dirty&&getFormControl('${key}').hasError('required')">{{'Please input ${key}!'|translate}}</div>
            </div>
            </div>
            `
        return tpl;
    }


    getDateTime(key, label) {
        let tpl = `
            <div nz-form-item nz-row>
            <div nz-form-label nz-col [nzSm]="6" [nzXs]="24">
                <label for="${key}" nz-form-item-required>
                    <span>
                        ${label}
                    </span>
                </label>
            </div>
            <div nz-form-control nz-col [nzSm]="14" [nzXs]="24" nzHasFeedback>
                <nz-timepicker [nzSize]="'large'" formControlName="${key}" ></nz-timepicker>
                <div nz-form-explain *ngIf="getFormControl('${key}').dirty&&getFormControl('${key}').hasError('required')">{{'Please input ${key}!'|translate}}</div>
            </div>
            </div>
            `
        return tpl;
    }





}
