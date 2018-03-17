import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-zselect',
    templateUrl: './zselect.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ZselectComponent),
            multi: true
        }
    ],
})
export class ZselectComponent implements OnInit {
    _value: number;
    options;
    @Input() data;
    onChange: any = Function.prototype;
    onTouched: any = Function.prototype;

    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {
        const tmp = [];
        for (const key in this.data) {
            tmp.push({ value: Number(key), label: this.data[key] });
        }
        this.options = tmp;
    }

    get nzValue(): number {
        return this._value;
    }
    set nzValue(value: number) {
        this._value = value;
        this.onChange(value);
    }

    writeValue(value: number) {
        this._value = value;
    }

    registerOnChange(fn: (_: number) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

}
