import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SdkService } from '@sdk/sdk.service';
import { QueryParam, QueryOp } from '@sdk/sdk.util';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-menue-select',
    templateUrl: './tpl.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MenuSelectComponent),
            multi: true
        }
    ]
})
export class MenuSelectComponent implements OnInit, ControlValueAccessor {
    public isVisible = false;
    public loading = false;
    public nzCheckable = false;
    public curNode;
    @Input()
    public showText: string;
    public nzReadonly = true;
    nodes = [];
    options = {
        getChildren: (node: any) => {
            return node.data.chindren;
        }
    };

    _value: string;
    onChange: any = Function.prototype;
    onTouched: any = Function.prototype;

    get nzValue(): any {
        return this._value;
    }

    set nzValue(value: any) {
        if ((this._value === value) || (((this._value === undefined) || (this._value === null)) && ((value === undefined) ||
            (value === null)))) {
            return;
        }
        this._value = value;
        this.onChange(value);

    }
    writeValue(value: any): void {
        this._value = value;
    }

    registerOnChange(fn: (_: any) => {}): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }
    constructor(private sdk: SdkService, private msg: NzMessageService) { }

    ngOnInit() { }

    handleOk = (e?: Event) => {
        if (e) {
            e.preventDefault();
        }
        if (this.curNode === undefined) {
            this.msg.error('未选择任何节点');
            return;
        }
        this.showText = this.curNode.displayField;
        this.nzValue = String(this.curNode.id);
        this.isVisible = false;
    }

    handleCancel = (e) => {
        e.preventDefault();
        this.isVisible = false;

    }

    showModal = () => {
        if (this.nodes.length === 0) {
            this.sdk.sys_menu_get_api([], 1, 99999).map((data) => {
                const results = data['results'];
                for (const row of data['results']) {
                    row['name'] = row['menuname'];
                    row['id'] = row['menuid'];
                }
                results.push({
                    "name" : "根目录",
                    "id" : 0,
                    "menuid": 0,
                    "menuname": "根目录",
                    "sortid": 0,
                    "parentid": -1,
                    "parentids": ","
                })

                return results;
            }).subscribe((res) => {
                this.nodes = this.transData(res, 'menuid', 'parentid', 'chindren');
            });
        }
        this.isVisible = true;
    }

    select() {
        this.handleOk();
    }

    nzFocus(ev: any) {
        this.curNode = ev.node;
    }

    onEvent(ev: any) {
        const me = this;
        if (ev['eventName'] === 'initialized') {
            if ((this._value === undefined) || (this._value === null) || (this._value === '')) {
                return;
            }
            const queryParam = new QueryParam('menuid', this._value, QueryOp.op_eq);
            this.sdk.sys_menu_get_api([queryParam], 1, 1).subscribe((res) => {
                if (res['results'].length === 1) {
                    me.showText = res['results'][0]['menuname'];
                }
            });

        }
    }

    transData(a, idStr, pidStr, chindrenStr) {
        let i = 0, j = 0;
        const r = [], hash = {}, id = idStr, pid = pidStr, children = chindrenStr, len = a.length;
        for (; i < len; i++) {
            hash[a[i][id]] = a[i];
        }
        for (; j < len; j++) {
            const aVal = a[j], hashVP = hash[aVal[pid]];
            if (typeof (hashVP) !== 'undefined') {
                if (!hashVP[children]) {
                    hashVP[children] = [];
                }
                hashVP[children].push(aVal);
                hashVP['hasChildren'] = true;
            } else {
                r.push(aVal);
            }
        }
        return r;
    }

}
