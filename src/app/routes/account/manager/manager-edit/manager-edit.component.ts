import { NzModalSubject } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { SdkService } from '@sdk/sdk.service';
import { _HttpClient } from '@delon/theme';
import * as model_sdk from '@sdk/sdk.model';
import * as skd_columns from '@sdk/sdk.columns';
import { EnumUserStatusTranslate, EnumIdTypeTranslate } from '@sdk/sdk.admins_enum';

import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms'

@Component({
    selector: 'app-manager-edit',
    templateUrl: './manager-edit.component.html',
})

export class ManagerEditComponent implements OnInit {
    _date = new Date("2016-01-01");

    i: any;
    is_new: boolean;
    title: string;
    idcardTypeOptions = EnumIdTypeTranslate;
    userStatusOptions = EnumUserStatusTranslate;
    public columns: Array<any> = skd_columns.muser_users_get_columns;

    edit_model: model_sdk.MuserUsersPost | model_sdk.MuserUsersPut;
    constructor(
        private fb: FormBuilder,
        private sdk: SdkService,
        private subject: NzModalSubject,
        public http: _HttpClient) { }

    ngOnInit() {
        if (Object.keys(this.i).length === 0) {
            this.is_new = true;
            this.title = '添加';
            this.edit_model = new model_sdk.MuserUsersPost();
        } else {
            this.is_new = false;
            this.title = '修改';
            this.edit_model = new model_sdk.MuserUsersPut();
        }

        const fields_options = this.edit_model.fields_options;
        const group = {}
        for (const index in fields_options) {
            const validator = this.getValidator(index, fields_options[index]);
            group[index] = validator;
        }
        if (this.is_new) {
            group['checkPassword'] = [null, [Validators.required, this.confirmationValidator]];
        }
        this.validateForm = this.fb.group(group);

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
        if (!this.is_new) {
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
        const val = this.is_new ? null : this.i[index];
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

    save() {

        if (this.is_new) {
            this.add();
        } else {
            this.update();
        }
    }

    update() {
        console.log(Object.assign(this.i, this.validateForm.getRawValue()));
        const param = Object.assign(this.edit_model, this.i, this.validateForm.getRawValue());
        console.log(param);
        this.sdk.muser_users_put_api(param).subscribe((res) => {
            this.subject.next('onOk');
            this.close();
        });
    }

    add() {
        const param = Object.assign(this.edit_model, this.validateForm.getRawValue());
        this.sdk.muser_users_post_api(param).subscribe((res) => {
            this.subject.next('onOk');
            this.close();
        });
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

    validateForm: FormGroup;

    _submitForm() {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
        }
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

    getCaptcha(e: MouseEvent) {
        e.preventDefault();
    }

    getFormControl(name) {
        return this.validateForm.controls[name];
    }
}
