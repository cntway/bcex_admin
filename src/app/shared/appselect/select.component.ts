import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectComponent),
            multi: true
        }
    ],
})
export class SelectComponent implements OnInit, ControlValueAccessor {

    @Input()
    public options: Array<any>;

    // ngModel Access
    _value: string;
    onChange: any = Function.prototype;
    onTouched: any = Function.prototype;

    constructor() { }

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

    ngOnInit() {
    }


}
