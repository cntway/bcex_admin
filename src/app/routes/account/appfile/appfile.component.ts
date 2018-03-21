import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';
import * as FileSaver from 'file-saver';
import * as skd_columns from '@sdk/sdk.columns';
import * as sdk_model from '@sdk/sdk.model';
import * as sdk_api from '@sdk/sdk.service';


@Component({
    selector: 'app-appfile',
    templateUrl: './appfile.component.html',
    styles: [`
    .cform {
      width: 60%;
    }
  `]
})
export class AppfileComponent implements OnInit {

    _sdk_model = sdk_model;
    _skd_columns = skd_columns;
    validateForm: FormGroup;
    editForm: FormGroup;
    searchColumnsOptions = [];
    searchModelOptions = [];
    searchApiOptions = [];


    searchColumns(event) {
        this.searchColumnsOptions = [];
        for (let key in this._skd_columns) {
            if (key.indexOf(event) > -1) {
                this.searchColumnsOptions.push([key]);
            }
        }
    }

    searchModel(event) {
        this.searchModelOptions = [];
        for (let key in this._sdk_model) {
            if (key.indexOf(event) > -1) {
                this.searchModelOptions.push([key]);
            }
        }
    }

    searchApi(event) {
        this.searchApiOptions = [];
        for (let key in this._sdk_api) {
            if (key.indexOf(event) > -1) {
                this.searchApiOptions.push([key]);
            }
        }
    }

    _submitForm() {
        // for (const i in this.validateForm.controls) {
        //     this.validateForm.controls[i].markAsDirty();
        // }
        let componentDf = this.validateForm.getRawValue();
        let componentTs = this.queryComponent(componentDf);
        let componentTemplate = this.queryTemplate(componentDf);

        let blobComponent = new Blob([componentTs], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blobComponent, `${this.nameChange(componentDf['componentName'])}.component.ts`);

        let blobHtml = new Blob([componentTemplate], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blobHtml, `${this.nameChange(componentDf['componentName'])}.component.html`);


    }

    _submitEditForm() {
        // for (const i in this.validateForm.controls) {
        //     this.validateForm.controls[i].markAsDirty();
        // }
        let componentDf = this.editForm.getRawValue();
        let componentTs = this.editComponent(componentDf);
        let componentTemplate = this.editTemplate(componentDf);

        let blobComponent = new Blob([componentTs], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blobComponent, `${this.nameChange(componentDf['componentName'])}.component.ts`);

        let blobHtml = new Blob([componentTemplate], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blobHtml, `${this.nameChange(componentDf['componentName'])}.component.html`);

    }

    constructor(private fb: FormBuilder, private _sdk_api: sdk_api.SdkService) {
    }



    ngOnInit() {
        console.log(this._skd_columns);
        this.validateForm = this.fb.group({
            deleteApi: [null, [Validators.required]],
            loadApi: [null, [Validators.required]],
            componentName: [null, [Validators.required]],
            deleteModel: [null, [Validators.required]],
            columns: [null, [Validators.required]],


        });

        this.editForm = this.fb.group({
            componentName: [null, [Validators.required]],
            columns: [null, [Validators.required]],
            editModel: [null, [Validators.required]],
            updateApi: [null, [Validators.required]],
        });
    }

    getFormControl(type: number, name: string) {
        if (type === 1) {
            return this.validateForm.controls[name];
        }
        if (type === 2) {
            return this.editForm.controls[name];
        }
    }

    makeClassName(name: string) {
        name = name.substring(0, 1).toUpperCase() + name.substring(1);
        return name;
    }

    nameChange(name: string) {
        name = name.replace(/([A-Z])/g, "-$1").toLowerCase();
        return name;
    }

    queryComponent(componentDf) {
        const tpl = `
                import { Observable } from 'rxjs/Rx';
                import { Component } from '@angular/core';
                import { ComponentBase } from '@sdk/sdk.component';
                import { QueryParam } from '@sdk/sdk.util';
                import * as sdk_model from '@sdk/sdk.model';
                import * as skd_columns from '@sdk/sdk.columns';
                import { ${this.makeClassName(componentDf['componentName'])}AddComponent } from './${componentDf['componentName']}-add/${componentDf['componentName']}-add.component';
                import { ${this.makeClassName(componentDf['componentName'])}EditComponent } from './${componentDf['componentName']}-edit/${componentDf['componentName']}-edit.component';
                
                @Component({
                    selector: 'app-${componentDf['componentName']}',
                    templateUrl: './${componentDf['componentName']}.component.html',
                })
                export class ${this.makeClassName(componentDf['componentName'])}Component extends ComponentBase {

                    public deleteModel = sdk_model.${componentDf['deleteModel']};
                    public columns: Array<any> = skd_columns.${componentDf['columns']};
                    public editComponent = ${this.makeClassName(componentDf['componentName'])}EditComponent;
                    public addComponent = ${this.makeClassName(componentDf['componentName'])}AddComponent;

                    loadData(): Observable<any> {
                        const parma_list = [];
                        Object.keys(this.args).forEach((key) => {
                            const qp = new QueryParam();
                            qp.key = key;
                            qp.value = this.args[key] + '%';
                            qp.op = qp.op_like;
                            parma_list.push(qp);
                        });
                        return this.sdk.${componentDf['loadApi']}(parma_list, this.pi).map((res): any => {
                            {
                                return res;
                            }
                        });
                    }

                    deleteData(data: any) {
                        const param = Object.assign(new this.deleteModel(), data);
                        return this.sdk.${componentDf['deleteApi']}(param);
                    }


                }
        `
        return tpl;
    }

    queryTemplate(componentDf) {
        const tpl = `
<nz-card>
    <ng-template #body>
        <form nz-form class="search-form" [nzLayout]="'inline'">
            <div nz-form-item>
                <label>{{"名称"|translate}}</label>
            </div>
            <div nz-form-item>
                <div nz-form-control>
                    <nz-input [(ngModel)]="args.username" name="username"></nz-input>
                </div>
            </div>
            <div nz-form-item>
                <div nz-form-control>
                    <button nz-button [nzType]="'primary'" (click)="load(1)" [nzLoading]="loading">{{"查询"|translate}}</button>
                    <button nz-button (click)="clear()" [disabled]="loading">{{"清除"|translate}}</button>
                </div>
            </div>
        </form>
    </ng-template>
</nz-card>

<nz-card>
    <ng-template #body>
        <div class="mb-sm text-right">
            <button nz-button [nzType]="'primary'" (click)="edit({})">{{'添加'|translate}}</button>
        </div>
        <nz-table #nzTable [nzAjaxData]="list" [nzShowSizeChanger]="true" [nzLoading]="loading" [nzTotal]="total" [(nzPageIndex)]="pi"
            (nzPageIndexChange)="load()" [(nzPageSize)]="ps" [nzBordered]="'true'" [nzShowTotal]="'false'">
            <thead nz-thead>
                <tr>
                    <th nz-th *ngFor="let column of columns" [nzWidth]="column.width">
                        <span>{{column.text|translate}}</span>
                    </th>
                    <th nz-th [nzWidth]="'200px'">
                        <span>{{'操作'|translate}}</span>
                    </th>
                </tr>
            </thead>

            <tbody nz-tbody>
                <tr nz-tbody-tr *ngFor="let data of nzTable.data">
                    <td nz-td *ngFor="let column of columns">
                        <span *ngIf="column.enum  else elseBlock ">{{column.enum[data[column.index]]}}</span>
                        <ng-template #elseBlock>
                            <span>{{data[column.index]}}</span>
                        </ng-template>
                    </td>
                    <td nz-td>
                        <a (click)="edit(data)">{{'修改'|translate}}</a>
                        <span nz-table-divider></span>

                    </td>
                </tr>
            </tbody>
        </nz-table>
    </ng-template>
</nz-card>
        `
        return tpl;
    }

    editComponent(componentDf) {
        const tpl = `
        import { Component } from '@angular/core';
        import { EditComponentBase } from '@sdk/sdk.component';
        import * as skd_columns from '@sdk/sdk.columns';
        import * as sdk_model from '@sdk/sdk.model';
        
        @Component({
            selector: 'app-${this.nameChange(componentDf['componentName'])}',
            templateUrl: './${this.nameChange(componentDf['componentName'])}.component.html',
        })
        export class ${this.makeClassName(componentDf['componentName'])}Component extends EditComponentBase {
        
            columns = skd_columns.${componentDf['columns']};
            edit_model = new sdk_model.${componentDf['editModel']}();
            save() {
                const param = Object.assign(this.edit_model, this.validateForm.getRawValue());
                this.sdk.${componentDf['updateApi']}(param).subscribe((res) => {
                    this.subject.next('onOk');
                    this.close();
                });
            }
        
        }
        `
        return tpl;
    }

    editTemplate(componentDf) {
        const me = this;
        //模版生成代码，可以抽象为工具
        let tpl_pre = `
        <div class="modal-header">
            <div class="modal-title">{{title|translate}}</div>
        </div>
        <form #f="ngForm" nz-form [formGroup]="validateForm">

        `
        let tpl_end = `
        </form>
        <div class="modal-footer">
            <button nz-button type="button" (click)="close()">{{"关闭"|translate}}</button>
            <button nz-button (click)="save()" [disabled]="!f.form.valid || !f.form.dirty" [nzLoading]="http.loading" [nzType]="'primary'">{{"保存"|translate}}</button>
        </div>
        `

        let tpl = '';
        const fields_options = eval(`new me._sdk_model.${componentDf['editModel']}()`).fields_options;
        console.log(fields_options);
        for (const index in fields_options) {
            const type = fields_options[index]['type'];
            if (this.isEmail(type, index)) {
                tpl += this.getEmail(index, this.getFieldName(index, componentDf));
            }
            if (this.isString(type, index)) {
                tpl += this.getString(index, this.getFieldName(index, componentDf));
            }
            if (this.isPwd(type, index)) {
                tpl += this.getPWd(index, this.getFieldName(index, componentDf));
            }
            if (this.isNumber(type, index)) {
                tpl += this.getNumber(index, this.getFieldName(index, componentDf));
            }
            if (this.isEnum(type, index)) {
                tpl += this.getEnum(index, this.getFieldName(index, componentDf), fields_options[index]['typeValue']);
            }
            if (this.isDate(type, index)) {
                tpl += this.getDate(index, this.getFieldName(index, componentDf));
            }
            if (this.isDateTime(type, index)) {
                tpl += this.getDateTime(index, this.getFieldName(index, componentDf));
            }
        }
        return tpl_pre + tpl + tpl_end;

    }

    getFieldName(key: string, componentDf: any): string {
        const me = this;
        for (let c of eval(`me._skd_columns.${componentDf['columns']}`)) {
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
        return sdk_model.STRING_LIST.indexOf(key) > -1 || sdk_model.BYTE_LIST.indexOf(key) > -1;
    }

    isDate(key: string, filedName: string): boolean {
        return key === 'date';
    }
    isDateTime(key: string, filedName: string): boolean {
        return key === 'datetime';
    }
    isNumber(key: string, filedName: string): boolean {
        return sdk_model.FLOAT_LIST.indexOf(key) > -1 || key === 'int32' || key === 'int64' || sdk_model.UINT_LIAT.indexOf(key) > -1;
    }
    isEnum(key: string, filedName: string): boolean {
        return key.length > 4 && (key.slice(0, 4) === 'Enum' || key.slice(-4) === 'Enum');
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
                    {{'${label}'|translate}}
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
                    {{'${label}'|translate}}
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

    getEnum(key, label, typeValue) {
        let tpl = `
        <div nz-form-item nz-row>
        <div nz-form-label nz-col [nzSm]="6" [nzXs]="24">
            <label for="${key}" nz-form-item-required>
                <span>
                    {{'${label}'|translate}}
                </span>
            </label>
        </div>
        <div nz-form-control nz-col [nzSm]="14" [nzXs]="24" nzHasFeedback>
            <app-zselect  [data]="${typeValue}Translate" formControlName="${key}" ></app-zselect>
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
                     {{'${label}'|translate}}
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
                     {{'${label}'|translate}}
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
